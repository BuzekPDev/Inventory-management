import { Product } from "../models/product.js";
import { Category } from "../models/category.js";
import { Edition } from "../models/edition.js";
import { Expansion } from "../models/expansion.js";

import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator'
import * as cloudinary from 'cloudinary'
import multer from 'multer'


const index = asyncHandler(async (req, res, next) => {
    const [categories, products, editions, expansions] = await Promise.all([
        Category.find()
                .exec(),

        Product.find()
               .populate('expansion')
               .populate('category')
               .populate('edition')
               .exec(),

        Edition.find()
               .exec(),
        
        Expansion.find()
                 .exec()
    ])

    if (!categories && !products && !editions && !expansions) {
        const err = new Error('Nothing found, all queries failed')
        err.status = 404
        return next(err)
    }

    res.render('pages/index', {
        categories: categories,
        editions: editions,
        expansions: expansions,
        products: products
    })
})

const productList = asyncHandler(async (req, res, next) => {
    const products = await Product.find()
                            .populate('expansion')
                            .populate('category')
                            .populate('edition')
                            .exec()

    if (!products) {
        const err = new Error('No products found') 
        err.status = 404
        return next(err)
    }

    res.render('pages/product_list', {
        products:products
    })
})

const productInfo = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
                                 .populate('edition')
                                 .populate('expansion')
                                 .populate('category')

    if (!product) {
        const err = new Error('Product not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/product_page', {
        product: product
    })
})


const productAddGet = asyncHandler( async (req, res, next) => {
    const [allEditions, allExpansions, allCategories] = await Promise.all([
        Edition.find()
               .sort({release_date: 1})
               .exec(),

        Expansion.find({},'name')
                 .sort({release_date:1})
                 .exec(),

        Category.find()
                .exec()
    ])

    res.render('pages/product_form', {
        editionList: allEditions,
        expansionList: allExpansions,
        categoryList: allCategories.reverse()
    })
})

const productAddPost = [
    (req, res, next) => {
        req.body.contents = req.body.contents.split(',')
        console.log(req.body.contents)
        next()
    },

    body('name', 'Product name must be filled out.')
        .trim()
        .isLength({min: 1})
        .withMessage('Product name must be at least 1 character long.')
        .escape(),

    body('description')
        .optional({values: 'falsy'})
        .trim()
        .escape(),

    body('contents.*', 'Product contents must be specified.')
        .trim()
        .escape(),

    body('category', 'Product category must be selected.')
        .trim()
        .isLength({min: 1})
        .escape(),

    body('expansion', 'Expansion must be selected')
        .trim()
        .isLength({min: 1})
        .escape(),
    
    body('msrp', 'Product MSRP must be set')
        .trim()
        .isInt({min: 1})
        .withMessage('MSRP cannot be less than 1 czk')
        .escape(),

    body('stock','Stock must be set')
        .trim()
        .isInt()
        .withMessage('Stock cannot be a floating point number, product count is not fractional')
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const storage = multer.memoryStorage()
        
        const uploadResult = await new Promise(resolve => {
            cloudinary.v2.uploader.upload_stream((err, res) => {
                return resolve(res)
            }).end(req.file.buffer)
        })

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            contents: req.body.contents,
            category: req.body.category,
            edition: req.body.edition,
            expansion: req.body.expansion,
            msrp: req.body.msrp,
            stock: req.body.stock,
            image: uploadResult.url
        })

        if (!errors.isEmpty()) {
            const [allEditions, allExpansions, allCategories] = await Promise.all([
                Edition.find()
                        .sort({release_date: 1})
                        .exec(),

                Expansion.find({},'name')
                        .sort({release_date:1})
                        .exec(),
        
                Category.find()
                        .exec()
            ])

            res.render('pages/product_form', {
                product: product,
                expansionList: allExpansions,
                categoryList: allCategories.reverse(),
                editionList: allEditions,
                errors: errors.array()
            })

        } else {
            await product.save()
            res.redirect(product.url)
        }
    })
]


// add delete pages after creating admin verification
const productDeleteGet = asyncHandler(async (req, res, next) => {
    res.send(`TO BE ADDED`)
})

const productDeletePost = asyncHandler(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id)
    res.redirect('/inventory/products')
})


const productUpdateGet = asyncHandler(async (req, res, next) => {
    const [product, allEditions, allExpansions, allCategories] = await Promise.all([
        Product.findById(req.params.id)
               .exec(),

        Edition.find()
               .sort({release_date: 1})
               .exec(),

       Expansion.find({},'name')
                .sort({release_date:1})
                .exec(),

       Category.find()
               .exec()
        
    ])

    if (!product) {
        const err = new Error('Product not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/product_form', {
        product: product,
        editionList: allEditions,
        expansionList: allExpansions,
        categoryList: allCategories
    })
})

const productUpdatePost = [
    (req, res, next) => {
        req.body.contents = req.body.contents.split(',')
        console.log(req.body.contents)
        next()
    },

    body('name', 'Product name must be filled out.')
        .trim()
        .isLength({min: 1})
        .withMessage('Product name must be at least 1 character long.')
        .escape(),

    body('description')
        .optional({values: 'falsy'})
        .trim()
        .escape(),

    body('contents.*', 'Product contents must be specified.')
        .trim()
        .escape(),

    body('category', 'Product category must be selected.')
        .trim()
        .isLength({min: 1})
        .escape(),

    body('expansion', 'Expansion must be selected')
        .trim()
        .isLength({min: 1})
        .escape(),
    
    body('msrp', 'Product MSRP must be set')
        .trim()
        .isInt({min: 1})
        .withMessage('MSRP cannot be less than 1 czk')
        .escape(),

    body('stock','Stock must be set')
        .trim()
        .isInt()
        .withMessage('Stock cannot be a floating point number, product count is not fractional')
        .escape(),

    body('image')
        .trim()
        .isURL()
        .withMessage('Must be a valid url'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            contents: req.body.contents,
            category: req.body.category,
            edition: req.body.edition,
            expansion: req.body.expansion,
            msrp: req.body.msrp,
            stock: req.body.stock,
            image: req.body.image,
            _id: req.params.id
        })


        if (!errors.isEmpty()) {
            const [allEditions, allExpansions, allCategories] = await Promise.all([
                Edition.find()
                        .sort({release_date: 1})
                        .exec(),

                Expansion.find({},'name')
                        .sort({release_date:1})
                        .exec(),
        
                Category.find()
                        .exec()
            ])

            res.render('pages/product_form', {
                product: product,
                expansionList: allExpansions,
                categoryList: allCategories.reverse(),
                editionList: allEditions,
                errors: errors.array()
            })
            return
        } else {
            await Product.findByIdAndUpdate(req.params.id, product)
            res.redirect(product.url)
        }
    })
]


export const productController = {
    index,
    productList,
    productInfo,
    productAddGet,
    productAddPost,
    productDeleteGet,
    productDeletePost,
    productUpdateGet,
    productUpdatePost
}