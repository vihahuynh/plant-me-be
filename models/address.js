const mongoose = require("mongoose")

const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
})

addressSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
