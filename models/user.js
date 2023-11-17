const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: false,
    trim: true
  },
  phonenNmber: {
    type: String,
    unique: false,
    required: false,
    trim: true
  },
  walletPublicKey: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = UserSchema = mongoose.model("user", UserSchema);
