const guestOrderRouter = require("express").Router();
const GuestOrder = require("./../models/guestOrder");
const middleware = require("./../utils/middleware")

guestOrderRouter.get("/", middleware.tokenExtractor, async (request, response, next) => {
    try {
        const { sortBy, limit, skip, ...filters } = request.query
        const sorts = sortBy?.split(":") || 'createdAt:desc'.split(":")
        if (user?.isAdmin) {
            const orders = await GuestOrder.find(filters)
                .sort([[sorts[0], sorts[1] === "desc" ? -1 : 1]])
                .limit(limit)
                .skip(skip)
            return response.json(orders);
        }
        return response.status(403).json({ err: "permission denied" });
    } catch (err) {
        next(err);
    }
});

guestOrderRouter.get("/:id", async (request, response, next) => {
    try {
        const order = await GuestOrder.findById(request.params.id).populate(
            "notification"
        ).exec()
        if (!order) {
            return response.status(404).json({ message: "No order found" });
        }
        return response.json(order)
    } catch (err) {
        next(err);
    }
});

guestOrderRouter.post("/", async (request, response, next) => {
    try {
        const { body } = request;
        const newOrder = new GuestOrder(body);
        const returedOrder = await newOrder.save();
        return response.status(201).json(returedOrder);
    } catch (err) {
        next(err);
    }
});

guestOrderRouter.patch("/:id", async (request, response, next) => {
    try {
        const updatedOrder = await GuestOrder.findByIdAndUpdate(
            request.params.id,
            request.body,
            { new: true, runValidators: true }
        );
        if (!updatedOrder) {
            return response.status(404).json({ message: "No order found" });
        }
        response.json(updatedOrder);
    } catch (err) {
        next(err);
    }
});

module.exports = guestOrderRouter;
