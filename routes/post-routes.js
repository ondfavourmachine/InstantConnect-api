const express = require("express");

// initialize the router class and save the instance in a router const
const router = express.Router();

const postController = require("../controllers/posts");
const verfiyToken = require("../Helpers/verifyTokens");

// since this is route for posts,
// we are going to use post method on the router instance

// also before the route can be accessed, we are going to check if
// the person trying to access this route is authenticated or has a
// valid token.

// we will add a middleware which will sit btw the request and a controller
// so verify token will check for the availability and validity of a token
// before passing it to postController which will then process the the
// request for appropriate response.

router.post("/posts/add", verfiyToken.verifyToken, postController.createPost);

module.exports = router;
