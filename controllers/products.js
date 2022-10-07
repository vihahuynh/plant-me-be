const productsRouter = require("express").Router();
const Product = require("./../models/product");
const upload = require("./../utils/uploadImages");
const middleware = require("./../utils/middleware");

productsRouter.get("/", async (request, response, next) => {
  try {
    const { sortBy, skip, limit, ...filters } = request.query;
    const parts = sortBy?.split(":");
    const products = await Product.find(filters)
      .sort([[parts?.[0], parts?.[1] === "desc" ? -1 : 1]])
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("reviews", {
        rating: true,
      })
      .populate("stocks")
      .exec();
    response.json(products);
  } catch (err) {
    next(err);
  }
});

productsRouter.get("/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const product = await Product.findById(id)
      .populate("reviews")
      .populate("stocks")
      .exec();
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
  [middleware.tokenExtractor, upload.array("images")],
  async (request, response, next) => {
    try {
      const user = request.user;
      const newProduct = JSON.parse(request.body?.obj);

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
  [middleware.tokenExtractor, upload.array("images")],
  async (request, response, next) => {
    try {
      const user = request.user;
      const { id } = request.params;
      const productToUpdate = JSON.parse(request.body?.obj);

      if (!user?.isAdmin) {
        return response.status(403).json({ error: "permission denied" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return response.status(404).json({ message: "No product found" });
      }

      const url = request.protocol + "://" + request.get("host");
      const newImages = request.files.map((f) => `${url}/photos/${f.filename}`);
      productToUpdate.images = productToUpdate.productImages.concat(newImages);

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
