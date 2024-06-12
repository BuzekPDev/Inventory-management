import mongoose from "mongoose";

const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    contents: [{type: String, required: true}],
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    edition: {type: Schema.Types.ObjectId, ref: 'Edition', required: true},
    expansion: {type: Schema.Types.ObjectId, ref: 'Expansion'},
    msrp: {type: Number, required: true},
    stock: {type: Number, required: true},
    image: {type: String}
})

productSchema.virtual('url').get(function () {
    return `/inventory/product/${this._id}`
})

export const Product = mongoose.model('Product', productSchema)