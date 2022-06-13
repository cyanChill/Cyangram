import mongoose from "mongoose";

const FollowerSchema = new mongoose.Schema({
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a userId."],
  },
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please provide a followerId."],
  },
});

export default mongoose.models.Follower ||
  mongoose.model("Follower", FollowerSchema);
