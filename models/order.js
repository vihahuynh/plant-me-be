const mongoose = require("mongoose");
const validator = require("validator")

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
  ],
  cart: [
    {
      image: String,
      title: {
        type: String,
        require: true,
        trim: true
      },
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
      discount: Number,
    },
  ],
  address: {
    type: String,
    require: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    require: true,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value, 'vi-VN')) {
        throw new Error("phone number is invalid")
      }
    }
  },
  receiverName: {
    type: String,
    require: true,
    trim: true,
  },
  paymentMethod: {
    type: String,
    require: true,
  },
  paymentStatus: String,
  status: {
    type: String,
    require: true,
  },
  receivedDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  estimatedDeliveryDate: Date,
  deliveryMethod: String,
  deliveryCharges: Number,
});

orderSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("Order", orderSchema);
