const emailRouter = require("express").Router()
const sendContactEmail = require("./../utils/sendContactEmail")

emailRouter.post("/", async (request, response, next) => {
    try {
        await sendContactEmail(request.body.name, request.body.email, request.body.content);
        response.json({ message: "Email has sent!" });
    } catch (err) {
        next(err);
    }
})

module.exports = emailRouter