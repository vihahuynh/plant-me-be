const productsRouter = require("express").Router();
const Product = require("./../models/product");
const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const upload = require("./../utils/uploadImages")

productsRouter.get("/", async (request, response, next) => {
  try {
    const products = await Product.find({});
    response.json(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const product = await Product.findById(id).populate("reviews")
    response.json(product);
  } catch (err) {
    next(err);
  }
});

productsRouter.post(
  "/",
  upload.array("images"),
  async (request, response, next) => {
    try {
      const newProduct = JSON.parse(request.body?.obj);
      const decodedToken = request.token
        ? jwt.verify(request.token, process.env.SECRET)
        : null;
      if (!decodedToken?.id) {
        return response.status(401).json({ error: "token missing or invalid" });
      }
      const user = await User.findById(decodedToken.id);

      if (!user?.isAdmin) {
        return response.status(403).json({ error: "permission denied" });
      }

      const url = request.protocol + "://" + request.get("host");

      newProduct.images = request.files.map(
        (f) => `${url}/photos/${f.filename}`
      );

      const product = new Product(newProduct);
      const addedProduct = await product.save();
      response.status(201).json(addedProduct);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = productsRouter;
