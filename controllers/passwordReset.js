const passwordResetRouter = require("express").Router()
const User = require("./../models/user")
const Token = require("./../models/token")
const middleware = require("./../utils/middleware")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const sendEmail = require("../utils/sendEmail")

passwordResetRouter.post("/", async (request, response, next) => {
    try {
        const user = await User.findOne({ email: request.body.email })
        if (!user) {
            response.status(404).json({ err: "No user found" })
        }
        const newToken = new Token({
            user: user.id,
            token: crypto.randomBytes(32).toString("hex"),
        })
        await newToken.save()

        const link = `${process.env.URL}/password-reset/${user.id}`
        await sendEmail(user.email, "Password reset", link)
        response.json({ message: "Password reset link had sent to user." })
    } catch (err) {
        next(err)
    }
})

passwordResetRouter.post("/:userId/:token", async (request, response, next) => {
    try {
        const user = await User.findById(request.params.userId)
        if (!user) {
            response.status().json({ err: "Invalid link or expired" })
        }
        const token = await Token.findOne({
            user: user.id,
            token: request.params.token
        })
        if (!token) {
            response.status().json({ err: "Invalid link or expired" })
        }
        const saltRounds = 10;
        user.passwordHash = await bcrypt.hash(request.body.password, saltRounds);
        await user.save()
        await token.remove()
        response.json({ message: "Password reset successfully." })

    } catch (err) {
        next(err)
    }
})


module.exports = passwordResetRouter
