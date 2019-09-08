const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  // set the object Id and reference the user who is signed in that created it.
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, default: "" },
  post: { type: String, default: "" },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: { type: String, default: "" },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now() }
    }
  ],

  totalLikes: { type: Number, default: 0 },
  likes: [{ username: { type: String, default: "" } }],
  created: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Posts", postSchema);
