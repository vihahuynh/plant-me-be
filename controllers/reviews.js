const jwt = require("jsonwebtoken")
const reviewRouter = require("express").Router()
const Review = require("../models/review")
const User = require("../models/user")
const Product = require("../models/product")

reviewRouter.get("/", async (request, response, next) => {
    try {
        const { query } = request
        console.log("---query---: ", query)
        const reviews = await Review.find().populate("user", { username: 1 }).populate("product", { title: 1 })
        response.json(reviews)
    } catch (err) {
        next(err)
    }
})

reviewRouter.post("/", async (request, response, next) => {
    try {
        const newReview = JSON.parse(request.body?.obj);
        const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
        if (!decodedToken?.id) {
            response.status(401).json({ err: "token missing or invalid" })
        }
        const user = await User.findById(decodedToken.id)
        const product = await Product.findById(body.productId)

        const url = request.protocol + "://" + request.get("host");

        newReview.images = request.files.map(
            (f) => `${url}/photos/${f.filename}`
        );
        newReview.user = user._id
        newReview.product = product._id

        const review = new Review(newReview)

        const savedReview = await review.save()
        user.reviews = user.reviews.concat(savedReview._id)
        await user.save()
        product.reviews = product.reviews.concat(savedReview._id)
        await product.save()
        response.json(savedReview)
    } catch (err) {
        next(err)
    }

})

module.exports = reviewRouter