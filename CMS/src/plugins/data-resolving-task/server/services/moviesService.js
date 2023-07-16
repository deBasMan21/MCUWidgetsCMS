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
          const resReviews = await fetch(`https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=${entry.Title}&api-key=${apiKey}`).then((res) => res.json())

          console.log(resReviews, entry)

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
