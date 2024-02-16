import fcmUtil from "../../../../plugins/strapi-plugin-fcm/util/fcm";

export default {
  afterCreate: async (event) => {
    await sendNotification(event);
  },
};

async function sendNotification(event) {
  const { result } = event;
  const { id, title, summary, imageUrl } = result;

  try {
    await fcmUtil.initialize(strapi);
  } catch (ex) {}

  await fcmUtil.send({
    title: title,
    body: summary,
    payload: {
      url: `https://mcuwidgets.page.link/news/${id}`,
    },
    image: imageUrl,
    targetType: "topics",
    target: "News",
    isReleaseNotification: false,
  });
}
