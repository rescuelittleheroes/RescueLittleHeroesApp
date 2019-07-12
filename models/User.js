const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = Schema(
  {
    username: { type: String, required: true },
    email: String,
    telephoneNumber: { type: String },
    password: String ,
    name: String,
    surname: String,
    githubId: String,
    instagramId: String,
    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User"
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
