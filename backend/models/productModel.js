const mongoose= require('mongoose')

const productSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    sizes: {
        type: Array,
        required: true,
    },
    bestSeller: {
        type: Boolean,
    },
    date: {
        type: Number,
        required: true,
    }
})

module.exports= mongoose.models.Product || mongoose.model('Product', productSchema)