const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    profilePhoto: String,
    email: String,
    password: String,
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", userSchema);
