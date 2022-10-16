const mongoose = require("mongoose");
const validator = require("validator");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    province: {
      required: true,
      type: {
        text: String,
        value: Number,
      },
    },
    district: {
      required: true,
      type: {
        text: String,
        value: Number,
      },
    },
    ward: {
      required: true,
      type: {
        text: String,
        value: Number,
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (value && !validator.isMobilePhone(value, "vi-VN")) {
          throw new Error("Phone number is invalid");
        }
      },
    },
    name: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

addressSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
