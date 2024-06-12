import mongoose from "mongoose";
import { DateTime } from "luxon";

const Schema = mongoose.Schema

const expansionSchema = new Schema({
    name: {type: String, required: true},
    shorthand:{type: String, required: true},
    description:{type: String},
    set_type:{type: String, required: true},
    edition:{type: Schema.Types.ObjectId, ref: 'Edition', required: true},
    release_date:{type: Date, required: true},
    logo: {type: String}
})

expansionSchema.virtual('url').get(function () {
    return `/inventory/expansion/${this._id}`
})

expansionSchema.virtual('release_date_yyyy_mm_dd').get(function () {
    return DateTime.fromJSDate(this.release_date).toISODate()
})

export const Expansion = mongoose.model('Expansion', expansionSchema)