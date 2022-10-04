const addressRouter = require("express").Router()
const Address = require("./../models/address")
const User = require("./../models/user")

addressRouter.get("/", async (request, response, next) => {
    try {
        const addresses = await Address.find({ user: request.user.id })
        response.json(addresses)
    } catch (err) {
        next(err)
    }
})

addressRouter.post("/", async (request, response, next) => {
    try {
        const newAddress = new Address({ ...request.body, user: request.user.id })
        const returnedAddress = await newAddress.save()
        response.status(201).json(returnedAddress)
    } catch (err) {
        next(err)
    }
})

addressRouter.patch("/:id", async (request, response, next) => {
    try {
        const address = await Address.findById(request.params.id)
        if (!address) {
            response.status(204).send()
        }
        if (address.user.toString() !== request.user.id) {
            response.status(403).json({ err: "permission denied" })
        }
        const updatedAddress = await Address.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
        response.json(updatedAddress)
    } catch (err) {
        next(err)
    }
})

addressRouter.delete("/:id", async (request, response, next) => {
    try {
        const address = await Address.findById(request.params.id)
        if (!address) {
            response.status(204).send()
        }
        if (address.user.toString() !== request.user.id) {
            response.status(403).json({ err: "permission denied" })
        }
        await Address.findByIdAndDelete(request.params.id)
        request.user.deliveryAddresses = request.user.deliveryAddresses.filter(address => address !== request.params.id)
        await request.user.save()
        response.status(204).send()
    } catch (err) {
        next(err)
    }
})

module.exports = addressRouter