const mongoose = require("mongoose");

// create a schema(a user schema);

const userSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  post: [
    {
      // this part of the schema will run whenever
      // a user creates a new post;
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
      post: { type: String },
      created: { type: Date, default: Date.now() }
    }
  ]
});

// export user schem
module.exports = mongoose.model("User", userSchema);
