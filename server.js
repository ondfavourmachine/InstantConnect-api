const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/secret");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth-routes");

// initialise the express application
const app = express();

// set the mongoose promise to the global promise
mongoose.Promise = global.Promise;

// establish a connection to the database
mongoose.connect(config.url, {
  useNewUrlParser: true
});

// establish some middleware using express body parser(optionally i could just install body parser)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// set a port number
const port = process.env.PORT || 3000;

//tell express to use the auth-route when it receives a certain request
app.use("/api/instantconnect", auth);

// start listening for requests to this server
app.listen(port, () => {
  console.log("InstantConnect is running on port: ", port);
});
