module.exports = [
  {
    method: 'POST',
    path: '/retrieveImages',
    handler: 'imageController.retrieve',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/updateProjectData',
    handler: 'projectController.updateProjectData',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/updateAllSeries',
    handler: 'seriesController.updateAllSeries',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/updateSeasons',
    handler: 'seriesController.updateSeasons',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/updateReviews',
    handler: 'moviesController.updateReviews',
    config: {
      policies: [],
    },
  },
];
