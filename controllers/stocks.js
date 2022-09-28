const stockRouter = require("express").Router()
const Stock = require("./../models/stock")
const Product = require("./../models/product")

stockRouter.get("/", async (request, response, next) => {
    try {
        const query = { request }
        const stocks = await Stock.find({ query })
        response.json(stocks)
    } catch (err) {
        next(err)
    }
})

stockRouter.post("/", async (request, response, next) => {
    try {
        const newStock = new Stock(request.body)
        const productId = request.body.product
        const product = await Product.findById(productId)
        if (!product) {
            return response.status(404).json({ err: "No product found" })
        }
        const existedStock = await Stock.findOne({ product: productId, color: request.body.color, size: request.body.size })
        if (existedStock) {
            return response.status(400).json({ err: `Stock is existed, please update instead of creating the new one. StockID: ${existedStock._id.toString()}` })
        }
        const stock = await newStock.save()
        product.stocks = product.stocks.concat(stock._id)
        await product.save()
        response.status(201).json(stock)
    }
    catch (err) {
        next(err)
    }
})

stockRouter.patch("/:id", async (request, response, next) => {
    try {
        const { id } = request.params
        const stock = await Stock.findByIdAndUpdate(id, request.body, { new: true, runValidators: true })
        if (!stock) {
            return response.status(404).json({ err: "No stock found" })
        }
        response.json(stock)
    } catch (err) {
        next(err)
    }
})

module.exports = stockRouter