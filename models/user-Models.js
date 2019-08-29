const mongoose = require("mongoose");

// create a schema(a user schema);

const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String }
});

// export user schem
module.exports = mongoose.model("User", userSchema);
