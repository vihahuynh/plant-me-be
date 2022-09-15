const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
    }],
    address: String,
    phoneNumber: String,
    receiverName: String,
    totalPayment: Number,

    shipFee: Number,
    discount: Number,
    netPayment: Number,
    paymentMethod: String,

    status: {
        type: String,
        default: 'Waiting for payment'
    },
    receivedDate: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})