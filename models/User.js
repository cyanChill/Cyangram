import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username."],
    unique: true,
    minlength: [1, "Usernames can't be less than 1 character."],
    maxlength: [30, "Usernames can't be more than 30 characters."],
  },
  email: {
    type: String,
    required: [true, "Please provide an email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a hashed password."],
    select: false,
  },
  privateProfile: {
    type: Boolean,
    default: false,
  },
  following: {
    type: Array,
    default: [{ type: ObjectId, ref: "User" }],
  },
  /* 
    Some other stuff including profile image (url or file id)
  */
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
