const mongoose = require("mongoose");

//     salePercent: 25,
//     rating: 4.3,
//     ratingCount: 173,
//     reviewCount: 33,
//     soldCount: 345,

const productSchema = new mongoose.Schema({
  images: {
    type: [String],
    required: true,
  },

  title: {
    required: true,
    type: String,
    trim: true,
  },
  // size: [String],
  // colors: [String],
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  salePercent: Number,
  about: String,
  livingConditions: [
    {
      id: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  plantCare: [
    {
      id: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  commonProblems: [
    {
      id: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  decorTips: [
    {
      id: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
