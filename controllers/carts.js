const cartRouter = require("express").Router()
const Cart = require("./../models/cart")

cartRouter.get("/:id", async (request, response, next) => {
    try {
        const user = request.user
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
        const user = request.user
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