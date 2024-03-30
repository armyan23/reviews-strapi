module.exports = {
  routes: [
    {
      method: "POST",
      path: "/sign-up",
      handler: "user.signUp",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sign-in",
      handler: "user.signIn",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/update-personal-details",
      handler: "user.updatePersonalDetails",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/users",
      handler: "user.getUsers",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
