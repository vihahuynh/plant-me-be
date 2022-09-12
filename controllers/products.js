const productsRouter = require('express').Router()
const Product = require('./../models/product')
const User = require('./../models/user')
const multer = require("multer")
const jwt = require('jsonwebtoken')

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
        console.log(file)
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

productsRouter.get('/', async (request, response, next) => {
    try {
        const products = await Product.find({})
        response.json(products)
    } catch (err) {
        next(err)
    }
})

productsRouter.post('/', upload.array('images'), async (request, response, next) => {
    try {
        const newProduct = JSON.parse(request.body?.obj)
        const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
        if (!decodedToken?.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const user = await User.findById(decodedToken.id)

        if (!user?.isAdmin) {
            return response.status(403).json({ error: 'permission denied' })
        }

        const url = request.protocol + '://' + request.get('host')

        newProduct.images = request.files.map(f => `${url}/photos/${f.filename}`)

        const product = new Product(newProduct)
        const addedProduct = await product.save()
        response.json(addedProduct)
    } catch (err) {
        next(err)
    }
})

module.exports = productsRouter
