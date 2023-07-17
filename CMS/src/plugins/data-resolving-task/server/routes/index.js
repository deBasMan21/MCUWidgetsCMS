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
    path: '/retrieveVideos',
    handler: 'videoController.retrieve',
    config: {
      policies: [],
    }
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
  {
    method: 'POST',
    path: '/updateSingleProject',
    handler: 'projectController.updateSingleProject',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/updateSingleSerie',
    handler: 'seriesController.updateSingleSerie',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/getCollections',
    handler: 'projectController.getCollections',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/updateCollectionRelations',
    handler: 'projectController.updateCollectionRelations',
    config: {
      policies: [],
    },
  },
];
