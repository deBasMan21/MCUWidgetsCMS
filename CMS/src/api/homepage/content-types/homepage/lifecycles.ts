export default {
  afterCreate(event) {
    setReviewPropsFromProject(event);
  },
  afterUpdate(event) {
    setReviewPropsFromProject(event);
  },
};

async function setReviewPropsFromProject(event) {
  const { result } = event;
  const { id } = result;
  let page: any = await strapi.entityService.findOne(
    "api::homepage.homepage",
    id,
    {
      populate: {
        components: {
          on: {
            // @ts-ignore
            "home-page.nyt-review": {
              populate: {
                project: true,
              },
            },
          },
        },
      },
    }
  );

  let components = page.components.map((component) => {
    if (component.project == null) {
      return undefined;
    }
    if (component.project.reviewTitle == component.reviewTitle) {
      return undefined;
    }

    return {
      id: component.id,
      __component: "home-page.nyt-review",
      reviewTitle:
        component.project.reviewTitle ?? component.reviewTitle ?? " ",
      reviewSummary:
        component.project.reviewSummary ?? component.reviewSummary ?? " ",
      reviewCopyright:
        component.project.reviewCopyright ?? component.reviewCopyright ?? " ",
    };
  });

  if (components.filter((comp) => comp != undefined).length <= 0) {
    return;
  }

  let allComponents = await strapi.entityService
    .findOne("api::homepage.homepage", id, {
      populate: {
        components: true,
      },
    })
    .then((res) => res.components);

  allComponents = allComponents.map((component) => {
    let filteredComponents = components.filter(
      (comp) => comp?.id == component.id
    );
    if (filteredComponents.length > 0) {
      return filteredComponents[0];
    }
    return component;
  });

  await strapi.entityService.update("api::homepage.homepage", id, {
    data: {
      components: allComponents,
    },
  });
}
