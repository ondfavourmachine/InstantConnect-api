// const Joi = require("@hapi/joi");
const httpStatusCodes = require("http-status-codes");
const Posts = require("../models/post-model");
const Joi = require("@hapi/joi");
const User = require("../models/user-Models");
// const helpers = require("../Helpers/helpers");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const config = require("../config/secret");

module.exports = {
  async createPost(req, res) {
    const validatedPostSchema = Joi.object().keys({
      post: Joi.string()
        .min(5)
        .required()
    });

    const { error } = Joi.validate(req.body, validatedPostSchema);
    if (error && error.details) {
      return res.status(httpStatusCodes.UNPROCESSABLE_ENTITY).json({
        message: error.details
      });
    }

    const body = {
      user: req.user_id,
      username: req.user.username,
      post: req.body.post,
      created: new Date()
    };

    try {
      const newPost = await Posts.create(body);
      console.log(newPost);
      await User.update(
        {
          username: newPost.username
        },
        {
          $push: {
            post: {
              postId: newPost._id,
              post: newPost.post,
              created: new Date()
            }
          }
        }
      );
      return res.status(httpStatusCodes.CREATED).json({
        message: "Post Created!",
        post: newPost
      });
    } catch (e) {
      console.log(e);
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Could not create post",
        errorDetails: e
      });
    }
  }
};
