const productsRouter = require('express').Router()
const Product = require('./../models/product')
const User = require('./../models/user')
const fs = require("fs")
const path = require("path")
const multer = require("multer")

const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './photos/');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, `${Date.now()}-${fileName}`)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

productsRouter.get('/', async (request, response) => {
    const products = await Product.find({})
    response.json(products)
})

productsRouter.post('/', upload.single('image'), async (request, response) => {
    const url = request.protocol + '://' + request.get('host')
    const newProduct = {
        image: url + '/photos/' + request.file.filename
    }
    const product = new Product(newProduct)
    const addedProduct = await product.save()
    response.json(addedProduct)
})

module.exports = productsRouter
