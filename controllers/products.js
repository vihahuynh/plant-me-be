const productsRouter = require("express").Router();
const Product = require("./../models/product");
const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const upload = require("./../utils/uploadImages");

productsRouter.get("/", async (request, response, next) => {
  try {
    const products = await Product.find({})
      .populate("reviews", {
        rating: true,
      })
      .populate("stocks");
    response.json(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const product = await Product.findById(id)
      .populate("reviews", {
        rating: 1,
      })
      .populate("stocks");
    if (!product) {
      return response.status(404).json({ message: "No product found" });
    }
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

productsRouter.patch(
  "/:id",
  upload.array("images"),
  async (request, response, next) => {
    try {
      const { id } = request.params;
      const productToUpdate = JSON.parse(request.body?.obj);
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

      const product = await Product.findById(id);
      if (!product) {
        return response.status(404).json({ message: "No product found" });
      }

      const url = request.protocol + "://" + request.get("host");
      const newImages = request.files.map((f) => `${url}/photos/${f.filename}`);
      productToUpdate.images = product.images.concat(newImages);

      delete productToUpdate.id;
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        productToUpdate,
        {
          new: true,
          runValidators: true,
        }
      );
      response.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = productsRouter;
