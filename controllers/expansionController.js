import { Expansion } from "../models/expansion.js"
import { Product } from '../models/product.js'
import { Edition } from '../models/edition.js'

import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator'

const expansionList = asyncHandler(async (req, res, next) => {
    const allExpansions = await Expansion.find().exec()

    if (!allExpansions) {
        const err = new Error('Expansion not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/expansion_list', {
        expansionList: allExpansions
    })

})

const expansionInfo = asyncHandler(async (req, res, next) => {
    const [expansion, productsInExpansion] = await Promise.all([
        Expansion.findById(req.params.id)
                 .populate('edition')
                 .exec(),

        Product.find({expansion: req.params.id})
               .populate('category')
               .exec()
    ])

    if (!expansion) {
        const err = new Error('Expansion not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/expansion_page', {
        expansion:expansion,
        productList: productsInExpansion
    })
})


const expansionAddGet = asyncHandler(async (req, res, next) => {
    const allEditions = await Edition.find()
                                     .sort({release_date:1})
                                     .exec()

    res.render('pages/expansion_form', {
        editionList: allEditions
    })
})

const expansionAddPost = [
    body('name', 'Expansion name must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Expansion name must be at least 1 character long'),
    
    body('shorthand', 'Expansion shorthand must be specified')
        .trim()
        .escape(),

    body('Description')
        .optional({values: 'falsy'})
        .trim()
        .escape(),

    body('settype', 'Expansion type must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Expansion type must be specified')
        .escape(),

    body('edition', 'Edition must be selected')
        .trim()
        .isLength({min: 1})
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

        const expansion = new Expansion({
            name: req.body.name,
            shorthand: req.body.shorthand,
            description: req.body.description,
            set_type: req.body.settype,
            edition: req.body.edition,
            release_date: req.body.releasedate,
            logo: req.body.logo
        })

        if (!errors.isEmpty()) {
            const allEditions = await Edition.find()
                                             .sort({release_date:1})
                                             .exec()

            res.render('pages/expansion_form', {
                expansion: expansion,
                editionList: allEditions,
                errors: errors.array()
            })
            return
        } else {
            const expansionExists = await Expansion.findOne({name: req.body.name})
                                             .collation({locale: 'en', strength:2})
                                             .exec()
            
            if (expansionExists) {
                res.redirect(expansionExists.url)
            } else {
                await expansion.save()
                res.redirect(expansion.url)
            }
        }
    })

]


const expansionDeleteGet = asyncHandler(async (req, res, next) => {
    res.send(`TO BE ADDED`)
})

const expansionDeletePost = asyncHandler(async (req, res, next) => {
    const productsInExpansion = Product.find({expansion: req.params.id})
                                       .populate('category')
                                       .exec()

    if (productsInExpansion.length) {
        const expansion = Expansion.findById(req.params.id)
                                   .populate('edition')
                                   .exec()

        res.render('pages/expansion_page', {
            expansion:expansion,
            productList: productsInExpansion,
            deleteFailed:true
        })
        return
    } else {
        await Expansion.findByIdAndDelete(req.params.id)
        res.redirect('/inventory/expansions')
    }
})


const expansionUpdateGet = asyncHandler(async (req, res, next) => {
    const [expansion, allEditions] = await Promise.all([
        Expansion.findById(req.params.id)
                 .exec(),

        Edition.find()
               .sort({release_date:1})
               .exec()
    ])

    if (!expansion) {
        const err = new Error('Expansion not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/expansion_form', {
        expansion:expansion,
        editionList: allEditions
    })
})

const expansionUpdatePost = [
    body('name', 'Expansion name must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Expansion name must be at least 1 character long'),
    
    body('shorthand', 'Expansion shorthand must be specified')
        .trim()
        .escape(),

    body('Description')
        .optional({values: 'falsy'})
        .trim()
        .escape(),

    body('settype', 'Expansion type must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Expansion type must be specified')
        .escape(),

    body('edition', 'Edition must be selected')
        .trim()
        .isLength({min: 1})
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

        const expansion = new Expansion({
            name: req.body.name,
            shorthand: req.body.shorthand,
            description: req.body.description,
            set_type: req.body.settype,
            edition: req.body.edition,
            release_date: req.body.releasedate,
            logo: req.body.logo,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            const allEditions = await Edition.find()
                                             .sort({release_date:1})
                                             .exec()

            res.render('pages/expansion_form', {
                expansion: expansion,
                editionList: allEditions,
                errors: errors.array()
            })
            return
        } else {
            await Expansion.findByIdAndUpdate(req.params.id, expansion)
            res.redirect(expansion.url)
        }
    })
]

export const expansionController = {
    expansionList,
    expansionInfo,
    expansionAddGet,
    expansionAddPost,
    expansionDeleteGet,
    expansionDeletePost,
    expansionUpdateGet,
    expansionUpdatePost
}