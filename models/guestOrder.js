const mongoose = require("mongoose");
const validator = require("validator");

const guestOrderSchema = new mongoose.Schema(
  {
    cart: [
      {
        image: String,
        title: {
          type: String,
          require: true,
          trim: true,
        },
        salePercent: Number,
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
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
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    address: {
      type: String,
      require: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      require: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "vi-VN")) {
          throw new Error("phone number is invalid");
        }
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is invalid");
        }
      },
    },
    totalDiscount: {
      type: Number,
      required: true,
    },
    totalPayment: {
      type: Number,
      required: true,
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
    progress: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    receivedDate: {
      type: Date,
    },
    estimatedDeliveryDate: Date,
    deliveryMethod: String,
    deliveryCharges: Number,
  },
  { timestamps: true }
);

guestOrderSchema.virtual("notification", {
  ref: "Notification",
  localField: "_id",
  foreignField: "order",
});

guestOrderSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("GuestOrder", guestOrderSchema);
