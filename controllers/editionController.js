import { Edition } from "../models/edition.js";

import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator'
import { Expansion } from "../models/expansion.js";

const editionList = asyncHandler(async (req, res, next) => {
    const allEditions = await Edition.find()
                                     .sort({release_date:1})
                                     .exec()

    if (!allEditions) {
        const err = new Error('No editions found')
        err.status = 404
        return next(err)
    }

    res.render('pages/edition_list', {
        editionList: allEditions
    })
})

const editionInfo = asyncHandler(async (req, res, next) => {
    const [edition, allExpansions] = await Promise.all([
        Edition.findById(req.params.id)
               .exec(),
        
        Expansion.find({edition: req.params.id}, 'name logo release_date')
                 .sort({release_date: 1})
                 .exec()
    ])

    if (!edition) {
        const err = new Error('Edition not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/edition_page', {
        edition: edition,
        expansionList: allExpansions
    })
})


const editionAddGet = asyncHandler(async (req, res, next) => {
    res.render('pages/edition_form')
})

const editionAddPost = [
    body('name', 'Edition name must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Edition name must be at least 1 character long'),
    
    body('shorthand', 'Edition shorthand must be specified')
        .trim()
        .escape(),

    body('releasedate', 'Release date must be specified')
        .isISO8601()
        .toDate(),

    body('logo')
        .trim()
        .isURL()
        .withMessage('Logo url must be a valid URL'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const edition = new Edition({
            name: req.body.name,
            shorthand: req.body.shorthand,
            release_date: req.body.releasedate,
            logo: req.body.logo
        })

        if (!errors.isEmpty()) {
            res.render('pages/edition_form', {
                edition: edition,
                errors:errors.array()
            })
            return
        } else {
            const editionExists = await Edition.findOne({name: req.body.name}).exec()

            if (editionExists) {
                res.redirect(editionExists.url)
            } else {
                await edition.save()
                res.redirect(edition.url)
            }
        }
    })
]

const editionDeleteGet = asyncHandler(async (req, res, next) => {
    res.send(`TO BE ADDED`)
})

const editionDeletePost = asyncHandler(async (req, res, next) => {
    const allExpansions = await Expansion.find({edition: req.params.id}, 'name release_date logo').exec()

    if (allExpansions.length) {
        const edition = await Edition.findById(req.params.id).exec()

        res.render('pages/edition_page', {
            edition:edition,
            expansionList: allExpansions,
            deleteFailed:true
        })
        return
    } else {
        await Edition.findByIdAndDelete(req.params.id).exec()
        res.redirect('/inventory/editions')
    }
})


const editionUpdateGet = asyncHandler(async (req, res, next) => {
    const edition = await Edition.findById(req.params.id).exec()

    if (!edition) {
        const err = new Error('Edition not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/edition_form', {
        edition: edition
    })
})

const editionUpdatePost = [
    body('name', 'Edition name must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Edition name must be at least 1 character long'),

    body('shorthand', 'Edition shorthand must be specified')
        .trim()
        .escape(),

    body('releasedate', 'Release date must be specified')
        .isISO8601()
        .toDate(),

    body('logo')
        .trim()
        .isURL()
        .withMessage('Logo url must be a valid URL'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const edition = new Edition({
            name: req.body.name,
            shorthand: req.body.shorthand,
            release_date: req.body.releasedate,
            logo: req.body.logo,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render('pages/edition_form', {
                edition: edition,
                errors: errors
            })
        } else {
            const editionExists = await Edition.findOne({name: req.body.name}).exec()

            if (editionExists) {
                res.redirect(editionExists.url)
            } else {
                await Edition.findByIdAndUpdate(req.params.id, edition, {})
                res.redirect(edition.url)
            }
        }
    })
]

export const editionController = {
    editionList,
    editionInfo,
    editionAddGet,
    editionAddPost,
    editionDeleteGet,
    editionDeletePost,
    editionUpdateGet,
    editionUpdatePost
}