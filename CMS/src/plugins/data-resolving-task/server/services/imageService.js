'use strict';

module.exports = ({ strapi }) => ({
  async getImages(id) {
    // Get entry from database
    const entry = await strapi.entityService.findOne('api::mcu-project.mcu-project', id, {
      fields: ['tmdb_id', 'id', 'Type']
    })

    // Check if entry exists
    if (!entry) {
      console.log("Entry not found")
      return
    }

    // Check if entry has tmdb_id
    if (!entry.tmdb_id) {
      console.log("Entry has no tmdb_id")
      return
    }

    // Get url prefix based on type
    const urlPrefix = entry.Type === "Serie" ? "tv" : "movie"

    const fetch = require('node-fetch')

    // Get configuration from tmdb (imageurl etc)
    const config = await fetch(`https://api.themoviedb.org/3/configuration`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    }).then((res) => res.json())

    // Get images from tmdb
    const res = await fetch(`https://api.themoviedb.org/3/${urlPrefix}/${entry.tmdb_id}/images?language=en`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    }).then((res) => res.json())

    // Check if there are posters
    if (res.posters) {
      let data = {}

      // Map the first 10 posters to poster objects
      data.Posters = res.posters.slice(0, 10).map((poster) => {
        return {
          PosterUrl: `${config.images.secure_base_url}[INSERT_SIZE]${poster.file_path}`,
        }
      })

      if (res.backdrops[0]) {
        const url = `${config.images.secure_base_url}[INSERT_SIZE]${res.backdrops[0]?.file_path}`
        data.backdropUrl = url
      }

      // Update the entry with the new posters
      await strapi.entityService.update('api::mcu-project.mcu-project', id, {
        data
      })
    }
  },
});
