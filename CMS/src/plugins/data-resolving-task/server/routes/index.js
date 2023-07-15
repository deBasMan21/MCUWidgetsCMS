module.exports = [
  {
    method: 'POST',
    path: '/retrieveImages',
    handler: 'imageController.retrieve',
    config: {
      policies: [],
    },
  },
];
