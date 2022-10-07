const reviewRouter = require("express").Router();
const Review = require("../models/review");
const upload = require("../utils/uploadImages");
const middleware = require("./../utils/middleware")

reviewRouter.get("/", async (request, response, next) => {
  try {
    const { query } = request;
    const reviews = await Review.find(query)
      .populate("createdBy", { username: 1, avatarUrl: 1 })
      .populate("product", { title: 1, images: 1 });
    response.json(reviews);
  } catch (err) {
    next(err);
  }
});

reviewRouter.patch("/:id", async (request, response, next) => {
  try {
    const { body } = request;
    const updatedReview = await Review.findByIdAndUpdate(
      request.params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    response.json(updatedReview);
  } catch (err) {
    next(err);
  }
});

reviewRouter.post(
  "/",
  [middleware.tokenExtractor, upload.array("images")],
  async (request, response, next) => {
    try {
      const newReview = JSON.parse(request.body?.obj);
      const user = request.user

      const url = request.protocol + "://" + request.get("host");

      newReview.images = request.files.map(
        (f) => `${url}/photos/${f.filename}`
      );
      newReview.user = user.id;
      newReview.product = newReview.productId

      const review = new Review(newReview);

      const savedReview = await review.save();
      response.status(201).json(savedReview);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = reviewRouter;
