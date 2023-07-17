'use strict';

module.exports = ({ strapi }) => ({
  async updateProjectData() {
    try {
      const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
        filters: {
          imdb_id: {
            $notNull: true
          }
        },
        fields: ['imdb_id', 'id']
      });

      const chunkSize = 25;
      for (let i = 0; i < entries.length; i += chunkSize) {
        const chunk = entries.slice(i, i + chunkSize);
        await getInfoForChunk(chunk)
      }
    } catch (error) {
      console.log(error)
    }
  },
  async updateSingleProject(id) {
    const entry = await strapi.entityService.findOne('api::mcu-project.mcu-project', id, {
      fields: ['imdb_id', 'id']
    })

    await getInfoForChunk([entry])
  },
  async getCollections() {
    const entries = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
      filters: {
        tmdb_id: {
          $notNull: true
        }
      },
      fields: ['tmdb_id', 'id', 'Type']
    })

    const fetch = require('node-fetch')

    const config = await fetch(`https://api.themoviedb.org/3/configuration`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    }).then((res) => res.json())

    let collections = await Promise.all(entries.map(async (entry) => {
      return await getCollectionForEntry(entry, fetch)
    }))

    let arrayUniqueByKey = [...new Map(collections.map(item => [item?.id, item])).values()].filter(collection => collection);

    await Promise.all(
      arrayUniqueByKey.map(async (collection) => {
        const existingCollection = await strapi.entityService.findMany('api::collection.collection', {
          filters: {
            tmdb_id: {
              $eq: `${collection.id}`
            }
          },
        })

        if (existingCollection.length > 0) {
          return
        }

        await strapi.entityService.create('api::collection.collection', {
          data: {
            tmdb_id: `${collection.id}`,
            name: collection.name,
            backdrop_url: `${config.images.secure_base_url}[INSERT_SIZE]${collection.backdrop_path}`,
          }
        })
        return collection
      })
    )
  },
  async updateCollectionRelations() {
    const entries = await strapi.entityService.findMany('api::collection.collection', {
      fields: ['tmdb_id', 'id']
    })

    const fetch = require('node-fetch')

    await Promise.all(entries.map(async (entry) => {
      const res = await fetch(`https://api.themoviedb.org/3/collection/${entry.tmdb_id}?language=en`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
      }).then((res) => res.json())

      let projects = await Promise.all(res.parts.map(async part => {
        let tmdbId = part.id
        let projects = await strapi.entityService.findMany('api::mcu-project.mcu-project', {
          filters: {
            tmdb_id: {
              $eq: tmdbId
            }
          },
          fields: ['id']
        })

        return projects[0]?.id
      }))


      let data = {
        tmdb_id: `${res.id}`,
        name: res.name,
        overview: res.overview,
        projects: projects.filter(project => project)
      }

      console.log(data)

      await strapi.entityService.update('api::collection.collection', entry.id, {
        data: data
      });
    }))
  }
});

async function getCollectionForEntry(entry, fetch) {
  const urlPrefix = entry.Type === "Serie" ? "tv" : "movie"

  const res = await fetch(`https://api.themoviedb.org/3/${urlPrefix}/${entry.tmdb_id}?language=en`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }
  }).then((res) => res.json())

  if (res.belongs_to_collection) {
    return res.belongs_to_collection
  }
}

async function getInfoForChunk(entries) {
  let idListString = entries.map(entry => entry.imdb_id).join(",")

  const fetch = require('node-fetch')
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
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
