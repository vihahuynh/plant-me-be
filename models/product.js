const mongoose = require("mongoose")

//     salePercent: 25,
//     rating: 4.3,
//     ratingCount: 173,
//     reviewCount: 33,
//     soldCount: 345,

const productSchema = new mongoose.Schema({
    image: {
        type: String
    },
    title: {
        // required: true,
        type: String,
    },
    size: [String],
    colors: [String],
    price: {
        type: Number,
        // required: true
    },
    salePercent: Number,
    about: String,
    livingCondition: [{
        title: {
            type: String,
            // required: true
        },
        text: {
            type: String,
            // required: true
        },
    }],
    plantCare: [{
        title: {
            type: String,
            // required: true
        },
        text: {
            type: String,
            // required: true
        },
    }],
    commonProblems: [{
        title: {
            type: String,
            // required: true
        },
        text: {
            type: String,
            // required: true
        },
    }],
    decorTips: [{
        title: {
            type: String,
            // required: true
        },
        text: {
            type: String,
            // required: true
        },
    }],
})

productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
