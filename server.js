const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/secret");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth-routes");
const posts = require("./routes/post-routes");
const cors = require("cors");

// initialise the express application
const app = express();

// set the mongoose promise to the global promise
mongoose.Promise = global.Promise;

// establish a connection to the database
mongoose.connect(config.url, {
  useNewUrlParser: true
});

// establish some middleware using express body parser(optionally i could just install body parser)

// this middleware instructs express to use cors
app.use(cors());

// then set up the cors setting

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// set a port number
const port = process.env.PORT || 3000;

//tell express to use the auth-route when it receives a certain request
app.use("/api/instantconnect", auth);
app.use("/api/instantconnect", posts);

// start listening for requests to this server
app.listen(port, () => {
  console.log("InstantConnect is running on port: ", port);
});
