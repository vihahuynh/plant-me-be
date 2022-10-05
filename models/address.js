const mongoose = require("mongoose")
const validator = require("validator")

const addressSchema = new mongoose.Schema({
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
        trim: true,
        required: true,
        validate(value) {
            if (value && !validator.isMobilePhone(value, "vi-VN")) {
                throw new Error("Phone number is invalid");
            }
        },
    },
    name: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

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
