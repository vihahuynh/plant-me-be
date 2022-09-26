const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    minlength: 5,
    trim: true,
  },
  avatarUrl: {
    type: String,
    default: "http://localhost:3001/photos/default-avatar.png",
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  phoneNumber: {
    type: String,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value, "vi-VN")) {
        throw new Error("phone number is invalid");
      }
    },
  },
  gender: {
    type: String,
    lowercase: true,
    validate(value) {
      if (
        value &&
        value.toLowerCase() !== "female" &&
        value.toLowerCase() !== "male"
      ) {
        throw new Error("gender is invalid");
      }
    },
  },
  passwordHash: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  notification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  likedReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  likedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
