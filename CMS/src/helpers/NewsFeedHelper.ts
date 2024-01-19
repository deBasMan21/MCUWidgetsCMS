import { parseStringPromise } from "xml2js";

export async function fetchAndUpdateNewsFeed() {
  strapi.log.info("NewsFeed: Starting NewsFeed update");
  const rssUrl = "https://thedirect.com/MCU/rss";

  let result = await fetch(rssUrl)
    .then((res) => res.text())
    .then((str) =>
      parseStringPromise(str, {
        trim: true,
        attrkey: "attr",
        charkey: "value",
        explicitArray: false,
      })
    );

  let newsItems: any[] = result.rss.channel.item.map((item: any) => {
    let categories: { category: string }[] = [];
    if (item.category.value) {
      categories = [{ category: item.category.value }];
    } else {
      categories = item.category.map((cat) => {
        return { category: cat.value };
      });
    }

    let image = item["media:group"]["media:content"][0].attr;
    return {
      guid: item.guid.value,
      url: item.link,
      title: item.title,
      summary: item.description,
      date_published: item["dc:date"],
      author: item["dc:creator"],
      content: item["content:encoded"].replace(/<[^>]*>?/gm, ""),
      categories: categories,
      image: {
        url: image.url,
        width: image.width,
        height: image.height,
      },
    };
  });

  strapi.log.info(
    `NewsFeed: Parsed ${newsItems.length} NewsItems from RSS feed`
  );

  await Promise.all(
    newsItems.map(async (newsItem) => {
      let existingItems = await strapi.entityService.findMany(
        "api::news-item.news-item",
        {
          filters: {
            guid: {
              $eq: newsItem.guid,
            },
          },
        }
      );

      if (existingItems.length == 0) {
        await strapi.entityService.create("api::news-item.news-item", {
          data: newsItem,
        });

        strapi.log.info(
          `NewsFeed: Created NewsItem with guid, ${newsItem.guid}`
        );
      }
    })
  );
}
