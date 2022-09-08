const productsRouter = require('express').Router()
const Product = require('./../models/product')
const User = require('./../models/user')

const jwt = require('jsonwebtoken');

productsRouter.get('/', async (request, response) => {
    const products = await Product.find({})
    response.json(products)
})

module.exports = productsRouter
