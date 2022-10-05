const nodemailer = require("nodemailer")
const logger = require("./../utils/logger")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

const sendEmail = async (email, subject, link) => {
    try {
        const filePath = path.join(__dirname, '../emails/password-reset.html');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const replacements = {
            link
        };
        const htmlToSend = template(replacements);
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
            html: htmlToSend
        })
        logger.info("Send email successfully")
    } catch (err) {
        throw new Error("Email not sent!")
    }
}

module.exports = sendEmail