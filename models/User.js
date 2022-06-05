import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username."],
    unique: true,
    minlength: [3, "Usernames can't be less than 3 character."],
    maxlength: [30, "Usernames can't be more than 30 characters."],
  },
  name: {
    type: String,
    minlength: [3, "Usernames can't be less than 3 character."],
    maxlength: [30, "Usernames can't be more than 30 characters."],
  },
  password: {
    type: String,
    required: [true, "Please provide a hashed password."],
    select: false,
  },
  bio: String,
  profilePic: {
    url: { type: String, required: [true, "Please provide a img url."] },
    identifier: {
      type: String,
      required: [true, "Please provide an img identifier in Firebase."],
    },
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
