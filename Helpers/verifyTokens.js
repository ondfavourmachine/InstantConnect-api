const jwt = require("jsonwebtoken");
const config = require("../config/secret");
const httpStatusCodes = require("http-status-codes");

// we want to verify our tokens before allowing users to post comments
// and other important stuff.

// this function is going to act as a middle ware.
module.exports = {
  verifyToken: (req, res, next) => {
    // remember we set saved the token in a cookie and called it auth,
    // we want to check for that cookie. it is cookies when checking;
    // i.e res.cookies not res.cookie. When setting it
    // console.log(req.headers);
    if (!req.headers.authorization) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        message: "No Authorization for requested resource."
      });
    }

    const token = req.cookies.auth || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(httpStatusCodes.FORBIDDEN).json({
        message: "No token provided!"
      });
    }

    return jwt.verify(token, config.jsonSecret, (err, decoded) => {
      if (err) {
        // if theres an error call next to move on since this is a helper function/middle ware
        // also check if the expiredtoken is not expired!
        if (err.expiredAt < new Date()) {
          return res.status(httpStatusCodes.UNAUTHORIZED).json({
            message:
              "Invalid Token. Session has expired, please login in again",
            token: null
          });
        }
        next();
      }

      // console.log("this is line 42", decoded.data);
      req.user = decoded.data;
      next();
    });
  }
};
