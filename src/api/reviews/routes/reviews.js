module.exports = {
  routes: [
    {
      method: "GET",
      path: "/google-reviews/:id",
      handler: "reviews.googleReviews",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
