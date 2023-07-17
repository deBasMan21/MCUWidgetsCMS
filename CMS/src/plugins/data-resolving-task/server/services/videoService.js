'use strict';

module.exports = ({ strapi }) => ({
  async getVideos(id) {
    // Get entry from database
    const entry = await strapi.entityService.findOne('api::mcu-project.mcu-project', id, {
      fields: ['tmdb_id', 'id', 'Type']
    })

    console.log(entry)

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

    // Get images from tmdb
    const res = await fetch(`https://api.themoviedb.org/3/${urlPrefix}/${entry.tmdb_id}/videos?language=en`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`
      }
    }).then((res) => res.json())

    // Check if there are posters
    if (res.results) {
      // Map the first 10 posters to poster objects
      const videos = res.results.filter(vid => vid.type == "Trailer").slice(0, 5).map((video) => {
        return {
          TrailerName: video.name,
          YoutubeLink: `https://youtu.be/${video.key}`,
        }
      })

      console.log(videos)

      // Update the entry with the new posters
      await strapi.entityService.update('api::mcu-project.mcu-project', id, {
        data: {
          Trailers: videos
        }
      })
    }
  },
});
