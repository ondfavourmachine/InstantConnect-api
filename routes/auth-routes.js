// import express because you need its router class to create routes

const express = require("express");

// initialize the router class and save the instance in a router const
const router = express.Router();

const authController = require("../controllers/auth-controller");

// since this is signUp and login,
// we are going to use post method on the router instance

router.post("/register", authController.createUser);
router.post("/login", authController.login);

module.exports = router;
