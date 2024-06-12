import mongoose from "mongoose";
import { DateTime } from 'luxon'

const Schema = mongoose.Schema

const editionSchema = new Schema({
    name: {type: String, required: true},
    shorthand: {type: String, required: true},
    release_date: {type: Date, required:true},
    logo: {type: String}
})

editionSchema.virtual('url').get(function () {
    return `/inventory/edition/${this._id}`
})

editionSchema.virtual('release_date_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.release_date).toISODate()
})

export const Edition = mongoose.model('Edition', editionSchema)