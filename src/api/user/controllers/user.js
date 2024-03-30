"use strict";
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const Validators = require("../../../validation/auth");
const UserValidators = require("../../../validation/user");
const axios = require("axios");

module.exports = {
  signUp: async (ctx) => {
    try {
      const { body } = ctx.request;

      const { error } = Validators.signUp(body);

      if (error) {
        console.log(error, 'error')
        return ctx.badRequest(error.details[0].message);
      }

      const existedUser = await strapi.db.query("plugin::users-permissions.user").findOne({
        select: ["email"],
        where: { email: body.email },
      });

      if (existedUser){
        return ctx.badRequest('User already exist.');
      }

      body.password = await bcrypt.hash(body.password, 10);
      const user = await strapi.db.query("plugin::users-permissions.user").create({
        select: ["id", "email", "firstName", "lastName"],
        data: {
          ...body,
          provider: 'local',
          role: { connect: [1] }
        }
      });

      return {
        message: "User registered successfully",
        data: user
      };
    } catch (e) {
      console.log('signUp', e)
      return ctx.internalServerError('Internal Server Error.');
    }
  },

  signIn: async (ctx) => {
    try {
      const { email, password } = ctx.request.body;
      const user = await strapi.db.query("plugin::users-permissions.user").findOne({
        select: ["email", "firstName", "lastName", "password"],
        where: { email },
      });

      if (!user) {
        return ctx.notFound('User not found.');
      }

      const { password: userPassword, ...restUser } = user
      const passwordMatch = await bcrypt.compare(password, userPassword);
      if (!passwordMatch) {
        return ctx.unauthorized('Authentication failed');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      return {
        message: "Successful",
        data: { token, data: restUser }
      };
    } catch (e) {
      console.log('signIn', e)
      return ctx.internalServerError('Internal Server Error.');
    }
  },

  updatePersonalDetails: async (ctx) => {
    try {
      const { body } = ctx.request

      const { error } = UserValidators.userDetails(body);

      if (error) {
        console.log(error, 'error')
        return ctx.badRequest(error.details[0].message);
      }

      if (body.googleReviews){
        let apiOutscraper = `https://api.app.outscraper.com/maps/reviews-v3?query=${body.companyName}${body.companyAddress}&reviewsLimit=1&async=false`
        const { data } = await axios.get(apiOutscraper, {
          headers: {
            'X-API-KEY': process.env.OUTSCRAPPER_TOKEN,
          },
        });

        if (data.data[0].google_id === '__NO_PLACE_FOUND__') {
          console.log('Error', data)
          return ctx.badRequest("Company didn't found!");
        }

        body.activatedTime = new Date()
        delete body.googleReviews
      } else {
        body.activatedTime = null
      }

      const user = await strapi.db.query("plugin::users-permissions.user").update({
        select: ["firstName", "lastName", "companyName", "companyAddress", "activatedTime"],
        where: { id: ctx.state.user.id },
        data: body
      });

      return {
        message: "Successful",
        data: user
      };
    } catch (e) {
      console.log('updatePersonalDetails', e)
      return ctx.internalServerError('Internal Server Error.');
    }
  },

  getUsers: async (ctx) => {
    try {
      const { page = 1 } = ctx.request.query

      if (!page){
        return ctx.badRequest('Page must be number.');
      }

      const user = await strapi.db.query("plugin::users-permissions.user").findMany({
        select: ["id", "email", "firstName", "lastName", "companyName", "companyAddress", "activatedTime"],
        where: { activatedTime: { $not: null } },
        orderBy: { activatedTime: 'desc' },
        offset: (page - 1) * 20,
        limit: 20
      });

      return {
        message: "Successful",
        data: user
      };
    } catch (e) {
      console.log('getUsers', e)
      return ctx.internalServerError('Internal Server Error.');
    }
  },
}
