const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // The text of the comment.
  comment: String,
  // The date and time when the comment was created.
  date_time: { type: Date, default: Date.now },
  // The ID of the user who created the comment.
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }
});

const commentModel = mongoose.model.Comments || mongoose.model("Comments", commentSchema);

module.exports = commentModel;