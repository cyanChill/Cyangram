import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a postId."],
  },
  commenterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a commenterId."],
  },
  content: {
    type: String,
    required: [true, "Please provide a comment."],
    maxlength: [200, "Comments can't be more than 200 characters."],
  },
  date: { type: Number, required: [true, "Please provide a date (in ms)."] },
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
