const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    checkoutAllItems: {
      type: Boolean,
      require: true,
      default: false,
    },
    items: [
      {
        isCheckout: {
          type: Boolean,
          require: true,
        },
        color: {
          type: String,
          require: true,
        },
        size: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          require: true,
        },
        title: {
          type: String,
          require: true,
        },
        image: {
          type: String,
          require: true,
        },
        price: {
          type: Number,
          require: true,
        },
        salePercent: Number,
        deliveryCharge: Number,
        discount: Number,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stock",
        },
      },
    ],
    quantity: {
      type: Number,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

cartSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Cart", cartSchema);
