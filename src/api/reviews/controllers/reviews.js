"use strict";
const axios = require("axios");

module.exports = {
  googleReviews: async (ctx) => {
    try {
      const { id } = ctx.request.params
      const { page } = ctx.request.query

      if (!id) {
        return ctx.notFound('Company not found.');
      }

      const company = await strapi.db.query("plugin::users-permissions.user").findOne({
        select: ["companyName", "companyAddress"],
        where: { id },
      });

      if (!company) {
        return ctx.notFound('Company not found.');
      }

      let apiOutscraper = `https://api.app.outscraper.com/maps/reviews-v3?query=${company.companyName}${company.companyAddress}&reviewsLimit=20&async=false&sort=newest`
      if (page) {
        apiOutscraper += `&lastPaginationId=${page}`
      }

      const { data } = await axios.get(apiOutscraper, {
        headers: {
          'X-API-KEY': process.env.OUTSCRAPPER_TOKEN,
        },
      });

      return {
        message: 'Successfully found',
        data
      }
    } catch (e) {
      console.log('googleReviews', e)
      return ctx.internalServerError('Internal Server Error.');
    }
  },
}
