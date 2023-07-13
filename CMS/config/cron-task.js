module.exports = {
  '*/1 * * * *': async () => {
    await publishNotifications();
  },
  '0 10 * * *': async () => {
    await getAllRatings();
  },
  '5 10 * * * ': async () => {
    await getReviews();
  },
  '35 13 * * *': async () => {
    await retrieveTmdbIds();
    await updateAllSeries()
  },
  '15 10 * * *': async () => {
    await updateSeasons()
  }
};

async function publishNotifications() {
  // fetch articles to publish;
  const draftArticleToPublish = await strapi.entityService.findMany('plugin::strapi-plugin-fcm.fcm-notification', {
    publicationState: 'preview', // preview returns both draft and published entries
    filters: {
      publishedAt: {
        $null: true, // so we add another condition here to filter entries that have not been published
      },
      publish_at: {
        $lt: new Date() // and we keep only articles with a 'publish_at' datetime value that is lower than the current datetime
      }
    }
  });
  // update the publish_at of articles previously fetched
  await Promise.all(draftArticleToPublish.map(article => {
    return strapi.entityService.update('plugin::strapi-plugin-fcm.fcm-notification', article.id, {
      data: {
        publishedAt: new Date(),
      }
    });
  }))
}

async function getReviews() {
  try {
    const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
      fields: ['Title'],
      filters: {
        $or: [
          {
            reviewTitle: {
              $null: true
            }
          },
          {
            reviewTitle: {
              $eq: ''
            }
          }
        ],
        ReleaseDate: {
          $lt: new Date().toISOString()
        },
        Type: {
          $eq: "Movie"
        }
      }
    });

    const fetch = require('node-fetch')
    const apiKey = process.env.NYT_TOKEN

    entries.forEach(async (entry) => {
      const resReviews = await fetch(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${entry.Title}&api-key=${apiKey}`).then((res) => res.json())

      if (resReviews.results?.length > 0) {
        let review = resReviews.results.filter(review => review.display_title == entry.Title)[0]

        strapi.entityService.update('api::mcu-project.mcu-project', entry.id, {
          data: {
            reviewTitle: decodeHtmlCharCodes(review?.headline ?? ""),
            reviewSummary: decodeHtmlCharCodes(review?.summary_short ?? ""),
            reviewCopyright: resReviews.copyright
          }
        });
      }
    })
  } catch (error) {
    console.log(error)
  }
}

async function getAllRatings() {
  try {
    const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
      filters: {
        imdb_id: {
          $notNull: true
        }
      },
      fields: ['imdb_id', 'id']
    });

    console.log(entries)

    const chunkSize = 25;
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      await getInfoForChunk(chunk)
    }
  } catch (error) {
    console.log(error)
  }
}

async function getInfoForChunk(entries) {
  let idListString = entries.map(entry => entry.imdb_id).join(",")

  const fetch = require('node-fetch')
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '994d69b14amsha92971d9137b5fap10df27jsn63fc46abced3',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
  };

  const [result, resAwards, resBoxOffice] = await Promise.all([
    fetch(`https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids?idsList=${idListString}&info=base_info`, options)
      .then((res) => res.json())
      .then((res) => res.results),
    fetch(`https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids?idsList=${idListString}&info=awards`, options)
      .then((res) => res.json())
      .then((res) => res.results),
    fetch(`https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids?idsList=${idListString}&info=revenue_budget`, options)
      .then((res) => res.json())
      .then((res) => res.results)
  ])

  var mergedItems = entries.map(t1 => ({
    objectId: t1.id,
    ...t1,
    ...result.find(t2 => t2.id === t1.imdb_id),
    ...resAwards.find(t2 => t2.id === t1.imdb_id),
    ...resBoxOffice.find(t2 => t2.id === t1.imdb_id)
  }))

  await Promise.all(mergedItems.map(entry => {
    var data = {}

    if (entry.meterRanking) {
      data.rankingCurrentRank = `${entry.meterRanking.currentRank}`
      if (entry.meterRanking.rankChange) {
        data.rankingDifference = `${entry.meterRanking.rankChange.difference}`
        data.rankingChangeDirection = `${entry.meterRanking.rankChange.changeDirection}`
      }
    }

    if (entry.ratingsSummary) {
      data.Rating = entry.ratingsSummary.aggregateRating
      data.VoteCount = entry.ratingsSummary.voteCount
    }

    if (entry.runtime) {
      data.Duration = entry.runtime.seconds / 60
    }

    if (entry.genres) {
      data.Categories = entry.genres.genres.map(genre => genre.text).join(', ')
    }

    if (entry.prestigiousAwardSummary) {
      data.AwardsNominated = entry.prestigiousAwardSummary.nominations
      data.AwardsWon = entry.prestigiousAwardSummary.wins
    }

    if (entry.worldwideGross) {
      data.BoxOffice = entry.worldwideGross.total.amount
    }

    if (entry.productionBudget) {
      if (entry.productionBudget.budget.amount) {
        data.ProductionBudget = entry.productionBudget.budget.amount
      }
    }

    return strapi.entityService.update('api::mcu-project.mcu-project', entry.objectId, {
        data: data
      });
  })).catch((err) => console.log(err))
}

function decodeHtmlCharCodes(str) {
  return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
    return String.fromCharCode(charCode);
  });
}

async function updateAllSeries() {
  const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
    fields: ['id', 'tmdb_id', 'seasonNumber'],
    filters: {
      tmdb_id: {
        $notNull: true
      },
      Type: {
        $eq: 'Serie'
      }
    }
  });

  const fetch = require('node-fetch')

  const config = await fetch(`https://api.themoviedb.org/3/configuration`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }
  }).then((res) => res.json())

  entries.forEach(async (entry) => {
    await retrieveSeriesEpisodes(entry, fetch, config)
  })
}

async function retrieveSeriesEpisodes(result, fetch, config) {
  const { id, tmdb_id, seasonNumber } = result

  let seasonInfo = await fetch(`https://api.themoviedb.org/3/tv/${tmdb_id}/season/${seasonNumber}?language=en-US`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }
  }).then((res) => res.json())

  console.log(seasonInfo)

  let episodes = seasonInfo.episodes.map((episode) => {
    return {
      EpisodeNumber: episode.episode_number,
      Title: episode.name,
      Description: episode.overview,
      Duration: episode.runtime,
      imageUrl: `${config.images.secure_base_url}[INSERT_SIZE]${episode.still_path}`,
      voteCount: episode.vote_count,
      Rating: episode.vote_average,
      EpisodeReleaseDate: episode.air_date,
      tmdb_id: `${episode.id}`
    }
  })

  await strapi.entityService.update('api::mcu-project.mcu-project', id, {
    data: {
      episodes
    }
  })
}

async function updateSeasons() {
  let series = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
    filters: {
      Type: {
        $eq: 'Serie'
      }
    },
    populate: {
      Seasons: {
        populate: {
          seasonProject: {
            populate: {
              Posters: true,
              episodes: true
            }
          }
        }
      }
    }
  })

  series.forEach(async (serie) => {
    let updatedSeasons = serie.Seasons.map((season) => {
      if (season.seasonProject.episodes) {
        season.NumberOfEpisodes = season.seasonProject.episodes.length
      }

      if (season.seasonProject.Posters) {
        season.imageUrl = season.seasonProject.Posters[0].PosterUrl
      }

      return season
    })

    await strapi.entityService.update('api::mcu-project.mcu-project', serie.id, {
      data: {
        Seasons: updatedSeasons
      }
    })
  })
}

async function retrieveTmdbIds() {
  const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
    fields: ['id', 'imdb_id', 'tmdb_id'],
    filters: {
      Type: {
        $eq: 'Serie'
      }
    }
  });

  const fetch = require('node-fetch')

  await Promise.all(entries.forEach(async (entry) => {
    let tmdbRes = await fetch(`https://api.themoviedb.org/3/find/${entry.imdb_id}?language=en-US&external_source=imdb_id`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    }).then((res) => res.json())

    console.log(tmdbRes)

    await strapi.entityService.update('api::mcu-project.mcu-project', entry.id, {
      data: {
        tmdb_id: `${tmdbRes.movie_results[0]?.id ?? tmdbRes.tv_results[0]?.id}`
      }
    })
  }))
}
