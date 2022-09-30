const cartRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Cart = require("./../models/cart")
const User = require("./../models/user")

cartRouter.get("/:id", async (request, response, next) => {
    try {
        const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
        if (!decodedToken?.id) {
            return response.status(401).json({ err: "invalid or missing token" })
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({ err: "No user found" })
        }
        const cart = await Cart.findById(request.params.id)
        if (!cart) {
            return response.status(404).json({ err: "No cart found" })
        }
        if (cart.user.toString() !== user._id.toString()) {
            return response.status(403).json({ err: "permission denied" })
        }
        response.json(cart)
    } catch (err) {
        next(err)
    }
})

cartRouter.post("/", async (request, response, next) => {
    try {
        const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
        if (!decodedToken?.id) {
            return response.status(401).json({ err: "invalid or missing token" })
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({ err: "No user found" })
        }
        const newCart = new Cart({
            ...request.body,
            user: user._id.toString()
        })

        const addedCart = await newCart.save()
        user.cart = addedCart._id.toString()
        await user.save()

        response.status(201).json(addedCart)
    } catch (err) {
        next(err)
    }
})

cartRouter.patch("/:id", async (request, response, next) => {
    try {
        const decodedToken = request.token ? jwt.verify(request.token, process.env.SECRET) : null
        if (!decodedToken?.id) {
            return response.status(401).json({ err: "invalid or missing token" })
        }
        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({ err: "No user found" })
        }

        const updatedCart = await Cart.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
        if (!updatedCart) {
            return response.status(404).json({ err: "No cart found" })
        }
        response.json(updatedCart)
    } catch (err) {
        next(err)
    }
})

module.exports = cartRouter