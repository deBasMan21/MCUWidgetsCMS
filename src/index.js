'use strict';

const { beforeUpdate } = require("./api/mcu-project/content-types/mcu-project/lifecycles");
const fetch = require('node-fetch')

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['api::mcu-project.mcu-project'],
      async beforeCreate(event) {
        await getExtraInformation(event)
      },
      async beforeUpdate(event) {
        await getExtraInformation(event)
      },
    })
  },
};

async function getExtraInformation(event) {
  const { result, params } = event;
  const { imdb_id } = params.data

  const extraInformation = await getExtraData(imdb_id)
  event.params.data.Rating = extraInformation.rating ?? event.params.data.Rating ?? null
  event.params.data.VoteCount = extraInformation.voteCount ?? event.params.data.VoteCount ?? null
  event.params.data.Categories = extraInformation.categories ?? event.params.data.Categories ?? null
  event.params.data.AwardsNominated = extraInformation.awardsNominated ?? event.params.data.AwardsNominated ?? null
  event.params.data.AwardsWon = extraInformation.awardsWon ?? event.params.data.AwardsWon ?? null
  event.params.data.BoxOffice = extraInformation.boxOffice ?? event.params.data.BoxOffice ?? null
  event.params.data.ProductionBudget = extraInformation.budget ?? event.params.data.ProductionBudget ?? null
}

async function getExtraData(imdbId) {
  if (!imdbId) {
    return {}
  }
  try {
    const fetch = require('node-fetch')
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '994d69b14amsha92971d9137b5fap10df27jsn63fc46abced3',
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
      }
    };

    const [res, resAwards, resBoxOffice] = await Promise.all([
      fetch(`https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids?idsList=${imdbId}&info=base_info`, options).then((res) => res.json()),
      fetch(`https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids?idsList=${imdbId}&info=awards`, options).then((res) => res.json()),
      fetch(`https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids?idsList=${imdbId}&info=revenue_budget`, options).then((res) => res.json())
    ])

    let result = res.results[0]
    let resultAwards = resAwards.results[0]
    let resultBoxOffice = resBoxOffice.results[0]

    let categories = result.genres.genres.map(genre => genre.text).join(', ')
    let returnObj = {
      rating: result.ratingsSummary?.aggregateRating,
      voteCount: result.ratingsSummary?.voteCount,
      categories: categories,
      awardsNominated: resultAwards.prestigiousAwardSummary?.nominations,
      awardsWon: resultAwards.prestigiousAwardSummary?.wins,
      boxOffice: resultBoxOffice.worldwideGross?.total.amount,
      budget: resultBoxOffice.productionBudget?.budget.amount
    }

    return returnObj
  } catch (error) {
    console.log(`Error: ${error}`)
    return {}
  }
}