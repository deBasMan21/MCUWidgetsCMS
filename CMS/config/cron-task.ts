import { fetchAndUpdateNewsFeed } from "../src/helpers/NewsFeedHelper";
import { publishNotifications } from "../src/helpers/NotificationHelper";

export default {
  "*/1 * * * *": async () => {
    await publishNotifications();
  },
  "0 10 * * *": async () => {
    await strapi
      .plugin("data-resolving-task")
      .service("projectService")
      .updateProjectData();
  },
  "1 10 * * * ": async () => {
    await strapi
      .plugin("data-resolving-task")
      .service("moviesService")
      .updateReviews();
  },
  "2 10 * * *": async () => {
    await strapi
      .plugin("data-resolving-task")
      .service("seriesService")
      .updateAllSeries();
  },
  "3 10 * * *": async () => {
    await strapi
      .plugin("data-resolving-task")
      .service("seriesService")
      .updateSeasons();
  },
  "0 * * * *": async () => {
    await fetchAndUpdateNewsFeed();
  },
};
