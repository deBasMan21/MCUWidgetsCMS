'use strict';

module.exports = ({ strapi }) => ({
  async updateAllSeries() {
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
  },

  async updateSeasons() {
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
});

async function retrieveSeriesEpisodes(result, fetch, config) {
  const { id, tmdb_id, seasonNumber } = result

  let seasonInfo = await fetch(`https://api.themoviedb.org/3/tv/${tmdb_id}/season/${seasonNumber}?language=en-US`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }
  }).then((res) => res.json())

  let episodes = seasonInfo.episodes.map((episode) => {
    let episodeData = {
      EpisodeNumber: episode.episode_number,
      Title: episode.name,
      Description: episode.overview,
      Duration: episode.runtime,
      voteCount: episode.vote_count,
      Rating: episode.vote_average,
      EpisodeReleaseDate: episode.air_date,
      tmdb_id: `${episode.id}`
    }

    if (episode.still_path) {
      episodeData.imageUrl = `${config.images.secure_base_url}[INSERT_SIZE]${episode.still_path}`
    }

    return episodeData
  })

  await strapi.entityService.update('api::mcu-project.mcu-project', id, {
    data: {
      episodes
    }
  })
}
