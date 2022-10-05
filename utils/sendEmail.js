const nodemailer = require("nodemailer")
const logger = require("./../utils/logger")

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject,
            text
        })
        logger.info("Send email successfully")
    } catch (err) {
        throw new Error("Email not sent!")
    }
}

module.exports = sendEmail