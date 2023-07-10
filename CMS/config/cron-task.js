module.exports = {
  '*/1 * * * *': async () => {
    await publishNotifications();
  },
  '0 10 * * *': async () => {
    await getAllRatings();
  },
  '0 10 * * * ': async () => {
    await getReviews();
  },
  '0 10 * * *': async () => {
    await updateAllSeries()
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

function createHTML(updatedCount, errors) {
  let totalData = updatedCount.map((entry) => getObjectProperties(entry)).join('<br /><br />')
  return `
    <html>
      <body style="margin: 0;">
        <div style="width: 100%; min-height: 100%; display: flex; justify-content: center; background-color: #EDEDEF;">
          <div style="width: 400px; background-color: #1C1C1E; color: #ffffff; padding: 10px; margin: 20px; border-radius: 10px; text-align: center;">
            <div style="width: 100%; display: flex; justify-content: center;">
              <img src="https://mcuwidgets.buijsenserver.nl/uploads/mcu_Widgets_Logo_Dark_94d943c6c2.png"
                style="width: 100px; height: 100px;">
            </div>
            <h1 style="width: 100%; text-align: center;">Hey there!</h1>
            <p style="width: 100%; text-align: center;">
              The cron task succeeded at <strong>${convertTZ(new Date(), 'Europe/Amsterdam').toLocaleString()}</strong>
              <br />
              A small overview of the task underneath here.
              <br />
              <strong>Updated ${updatedCount.length} entries:</strong>
              <br />
              ${totalData}
              <br />
              <br />
              <br />
              Encountered ${errors.length} errors.
              <br />
              <br />
              That was it for today. Have a nice day!
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

function convertTZ(date, tzString) {
    return new Date(date.toLocaleString("en-US", {timeZone: tzString}));
}

function getObjectProperties(data) {
  let title = data.title
  delete data.title
  let keys = Object.keys(data)
  return `<h2>${title}</h2>` + keys.map(key => {
    return `<strong>${key}: </strong>${data[key]}<br />`
  }).join('');
}

async function updateAllSeries() {
  const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
    fields: ['id', 'imdb_id', 'seasonNumber'],
    filters: {
      imdb_id: {
        $notNull: true
      },
      type: {
        $eq: 'Serie'
      }
    }
  });

  const fetch = require('node-fetch')
  console.log(entries)

  entries.forEach(async (entry) => {
    await retrieveSeriesEpisodes(entry, fetch)
  })
}

async function retrieveSeriesEpisodes(result, fetch) {
  const { id, imdb_id, seasonNumber } = result
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '994d69b14amsha92971d9137b5fap10df27jsn63fc46abced3',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
  };

  let seasonInfo = await fetch(`https://moviesdatabase.p.rapidapi.com/titles/series/${imdb_id}/${seasonNumber}`, options)
    .then((res) => res.json())
    .then((res) => res.results)

  let episodes = seasonInfo.map((episode) => {
    return { imdb_id: episode.tconst, episodeNumber: episode.episodeNumber }
  })

  let episodeData = await Promise.all(episodes.map(async (episode) => {
    let imdbData = await fetch(`https://moviesdatabase.p.rapidapi.com/titles/episode/${episode.imdb_id}?info=base_info`, options)
      .then((res) => res.json())
      .then((res) => res.results)

    let episodeObject = {
      imdb_id: episode.imdb_id,
      EpisodeNumber: episode.episodeNumber,
      PostCreditScenes: 0
    }

    if (imdbData.releaseDate) {
      let date = new Date()
      date.setFullYear(imdbData.releaseDate.year)
      date.setMonth(imdbData.releaseDate.month)
      date.setDate(imdbData.releaseDate.day)

      episodeObject.EpisodeReleaseDate = date.toISOString()
    }

    if (imdbData.ratingsSummary) {
      episodeObject.Rating = imdbData.ratingsSummary.aggregateRating
      episodeObject.voteCount = imdbData.ratingsSummary.voteCount
    }

    if (imdbData.primaryImage) {
      episodeObject.imageUrl = imdbData.primaryImage.url
      episodeObject.imageCaption = imdbData.primaryImage.caption.plainText
    }

    if (imdbData.genres) {
      episodeObject.categories = imdbData.genres.genres.map(genre => genre.text).join(', ')
    }

    if (imdbData.titleText) {
      episodeObject.Title = imdbData.titleText.text
    }

    if (imdbData.plot) {
      episodeObject.Description = imdbData.plot.plotText.plainText
    }

    if (imdbData.runtime) {
      episodeObject.Duration = imdbData.runtime.seconds / 60
    }

    return episodeObject
  }))

  await strapi.entityService.update('api::mcu-project.mcu-project', id, {
    data: {
      episodes: episodeData
    }
  })
}
