const jwt = require("jsonwebtoken");
const reviewRouter = require("express").Router();
const Review = require("../models/review");
const User = require("../models/user");
const Product = require("../models/product");
const upload = require("../utils/uploadImages");

reviewRouter.get("/", async (request, response, next) => {
  try {
    const { query } = request;
    const reviews = await Review.find(query)
      .populate("createdBy", { username: 1 })
      .populate("product", { title: 1 });
    response.json(reviews);
  } catch (err) {
    next(err);
  }
});

reviewRouter.put("/:id", async (request, response, next) => {
  try {
    const { body } = request;
    const review = {
      title: body.title,
      content: body.content,
      unlike: body.unlike,
      like: body.like,
      images: body.images,
      createdBy: body.createdBy,
      product: body.product,
    };

    const updatedReview = await Review.findByIdAndUpdate(
      request.params.id,
      review,
      {
        new: true,
      }
    );

    response.json(updatedReview);
  } catch (err) {
    next(err);
  }
});

reviewRouter.post(
  "/",
  upload.array("images"),
  async (request, response, next) => {
    try {
      const newReview = JSON.parse(request.body?.obj);
      const decodedToken = request.token
        ? jwt.verify(request.token, process.env.SECRET)
        : null;
      if (!decodedToken?.id) {
        response.status(401).json({ err: "token missing or invalid" });
      }
      const user = await User.findById(decodedToken.id);
      const product = await Product.findById(newReview.productId);

      const url = request.protocol + "://" + request.get("host");

      newReview.images = request.files.map(
        (f) => `${url}/photos/${f.filename}`
      );
      newReview.user = user._id;
      newReview.product = product._id;

      const review = new Review(newReview);

      const savedReview = await review.save();
      user.reviews = user.reviews.concat(savedReview._id);
      await user.save();
      product.reviews = product.reviews.concat(savedReview._id);
      await product.save();
      response.status(201).json(savedReview);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = reviewRouter;
