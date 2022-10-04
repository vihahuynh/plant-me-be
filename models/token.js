const mongoose = require("mongoose")

const tokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 3600
    }
})

tokenSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;