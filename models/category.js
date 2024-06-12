import mongoose from "mongoose";

const Schema = mongoose.Schema

const categorySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String}
})

categorySchema.virtual('url').get(function () {
    return `/inventory/category/${this._id}`
})

export const Category = mongoose.model('Category', categorySchema)