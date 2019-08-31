const Joi = require("@hapi/joi");
const httpStatusCodes = require("http-status-codes");
const User = require("../models/user-Models");
const helpers = require("../Helpers/helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/secret");

module.exports = {
  async createUser(req, res) {
    const schema = Joi.object().keys({
      username: Joi.string()
        .min(5)
        .required(),
      password: Joi.string()
        .min(5)
        .required(),
      email: Joi.string()
        .email()
        .required()
    });

    // use joi with a callback else it will cause errors!

    // however we will refactor later
    const { error, validatedUser } = Joi.validate(req.body, schema);

    if (error && error.details) {
      return res
        .status(httpStatusCodes.BAD_REQUEST)
        .json({ message: error.details });
    }
    // res.send({ validatedUser, message: "successfully validated!" });

    // we could have used validatedUser eg validatedUser.email or validatedUser.username
    const userEmail = await User.findOne({
      email: helpers.convertToLowerCase(req.body.email)
    });
    if (userEmail) {
      return res
        .status(httpStatusCodes.CONFLICT)
        .json({ message: "Email already exists" });
    }

    const username = await User.findOne({
      username: helpers.makeFirstLetterUpperCase(req.body.username)
    });

    if (username) {
      return res
        .status(httpStatusCodes.CONFLICT)
        .json({ message: "Username already exists" });
    }

    return bcrypt.hash(req.body.password, 10, async (error, hash) => {
      if (error) {
        return res
          .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "An error occured please contact admin" });
      }

      const user = {
        username: helpers.makeFirstLetterUpperCase(req.body.username),
        email: helpers.convertToLowerCase(req.body.email),
        password: hash
      };

      try {
        const newUser = await User.create(user);
        const token = jwt.sign({ data: newUser }, config.jsonSecret, {
          expiresIn: "120"
        });
        res.cookie("auth", token);
        return res
          .status(httpStatusCodes.CREATED)
          .json({ message: "User created successfully", newUser, token });
      } catch (e) {
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Error occured while saving the user!",
          error: err
        });
      }

      // newUser
      //   .then(createdUser => {
      //     return res
      //       .status(httpStatusCodes.CREATED)
      //       .json({ message: "User created successfully", createdUser });
      //   })
      //   .catch(err => {
      //     res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      //       message: "Error occured while saving the user!",
      //       error: err
      //     });
      //   });
    });
  }
};
