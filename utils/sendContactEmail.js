const nodemailer = require("nodemailer")
const logger = require("./logger")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

const sendContactEmail = async (name, email, content) => {
    try {
        const filePath = path.join(__dirname, '../emails/contact.html');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const replacements = {
            name, email, content
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
            to: "huynhviha1703@gmail.com",
            subject: "User contact email",
            html: htmlToSend
        })
        logger.info("Send email successfully")
    } catch (err) {
        throw new Error("Email not sent!")
    }
}

module.exports = sendContactEmail