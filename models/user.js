const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      minlength: 5,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "/photos/default-avatar.png",
    },
    subscribed: {
      type: Boolean,
      default: false,
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
        if (value && !validator.isMobilePhone(value, "vi-VN")) {
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
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const userForToken = {
    username: this.username,
    id: this._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 7 * 24 * 60 * 60,
    // expiresIn: 30,
  });
  return token;
};

userSchema.statics.findByCredentials = async (loginData, password) => {
  let user;
  user = await User.findOne({ username: loginData });
  if (!user) {
    user = await User.findOne({ email: loginData });
  }
  if (!user) {
    throw new Error("Unable to login");
  }

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("notification", {
  ref: "Notification",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("deliveryAddresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "user",
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
