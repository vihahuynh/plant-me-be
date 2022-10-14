const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      required: true,
    },

    title: {
      required: true,
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePercent: Number,
    about: String,
    watering: String,
    light: String,
    idealLocation: [String],
    whereToGrow: [String],
    specialFeatures: [String],
    typeOfPlants: [String],
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
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

productSchema.virtual("stocks", {
  ref: "Stock",
  localField: "_id",
  foreignField: "product",
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
