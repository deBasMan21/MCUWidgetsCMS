'use strict';

module.exports = ({ strapi }) => ({
  async updateReviews() {
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

      var interval = 12000; // how much time should the delay between two iterations be (in milliseconds)?
      var promise = Promise.resolve();
      entries.forEach(function (entry) {
        promise = promise.then(async function () {
          let requestUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=section_name:"Movies" AND type_of_material:"Review"&q=${entry.Title}&api-key=${apiKey}`
          const resReviews = await fetch(requestUrl).then((res) => res.json())

          console.log(resReviews, entry)

          if (resReviews.response?.docs?.length > 0) {
            console.log(resReviews.response?.docs?.map(review => review.headline?.main))
            let filteredReviews = resReviews.response?.docs.filter(review => review.headline.main.includes(entry.Title))
            let review = filteredReviews[0]

            strapi.entityService.update('api::mcu-project.mcu-project', entry.id, {
              data: {
                reviewTitle: decodeHtmlCharCodes(review?.headline?.main ?? ""),
                reviewSummary: decodeHtmlCharCodes(review?.abstract ?? ""),
                reviewCopyright: resReviews.copyright,
                reviewUrl: review?.web_url
              }
            });
          }

          return new Promise(function (resolve) {
            setTimeout(resolve, interval);
          });
        });
      });

      await promise;
      console.log('Reviews updated')
    } catch (error) {
      console.log(error)
    }
  }
});

function decodeHtmlCharCodes(str) {
  return str.replace(/(&#(\d+);)/g, function (match, capture, charCode) {
    return String.fromCharCode(charCode);
  });
}
