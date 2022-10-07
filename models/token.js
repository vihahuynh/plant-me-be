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
})

tokenSchema.set("toJSON", {
    timestamps: true,
    virtuals: true,
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;