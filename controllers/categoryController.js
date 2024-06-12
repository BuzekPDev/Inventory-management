import { Category } from "../models/category.js";
import { Product } from "../models/product.js";

import asyncHandler from "express-async-handler";
import { body, validationResult } from 'express-validator'

const categoryList = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec()

    if (!allCategories) {
        const err = new Error('No categories found')
        err.status = 404
        return next(err)
    }

    res.render('pages/category_list', {
        categoryList: allCategories
    })
})

const categoryInfo = asyncHandler(async (req, res, next) => {
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id)
                .exec(),
        
        Product.find({category: req.params.id}, 'image name msrp stock')
               .exec()
    ])

    if (!category) {
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/category_page', {
        category: category,
        productList: productsInCategory
    })
})


const categoryAddGet = asyncHandler(async (req, res, next) => {
    
    res.render('pages/category_form')
})

const categoryAddPost = [
    body('name','Category name must be specified')
        .trim()
        .isLength({min:1})
        .withMessage('Category name must be at least 1 character long')
        .escape(),

    body('description', 'Category description must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Category description must be at least 1 character long')
        .escape(),

    body('image')
        .optional({values: 'falsy'})
        .isURL()
        .withMessage('Image url must be a valid url'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image
        })

        if (!errors.isEmpty()) {
           
            res.render('pages/category_form', {
                category: category,
                errors: errors.array()
            })
             
            return
        } else {
            const categoryExists = await Category.findOne({name:req.body.name})
                                                 .collation({locale: 'en', strength: 2})
                                                 .exec()

            if (categoryExists) {
                res.redirect(categoryExists.url)
            } else {
                await category.save()
                res.redirect(category.url)
            }
        }
    })
]


const categoryDeleteGet = asyncHandler(async (req, res, next) => {
    // res.send(`TO BE ADDED`)
})

const categoryDeletePost = asyncHandler(async (req, res, next) => {
    const productsInCategory = await Product.find({category: req.params.id}).exec()

    if (productsInCategory.length) {
        const category = await Category.findById(req.params.id).exec()
        
        res.render('pages/category_page', {
            category: category,
            productList: productsInCategory,
            deleteFailed: true
        })
        
        return
    } else {
        await Category.findByIdAndDelete(req.params.id)
        res.redirect('/inventory/categories')
    }
})


const categoryUpdateGet = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (!category) {
        const err = new Error('Category not found')
        err.status = 404
        return next(err)
    }

    res.render('pages/category_form', {
        category: category
    })
})

const categoryUpdatePost = [
    body('name','Category name must be specified')
        .trim()
        .isLength({min:1})
        .withMessage('Category name must be at least 1 character long')
        .escape(),

    body('description', 'Category description must be specified')
        .trim()
        .isLength({min: 1})
        .withMessage('Category description must be at least 1 character long')
        .escape(),

    body('image')
        .optional({values: 'falsy'})
        .isURL()
        .withMessage('Image url must be a valid url'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            _id: req.params.id
        })

        if (!errors.isEmpty()) {
            res.render('pages/category_form', {
                category:category,
                errors: errors.array()
            })
            return
        } else {
            const categoryExists = await Category.findOne({name: req.body.name})
                                                 .collation({locale: 'en', strength: 2})
                                                 .exec()

            if (categoryExists) {
                res.redirect(categoryExists.url)
            } else {
                await Category.findByIdAndUpdate(req.params.id, category, {})
                res.redirect(category.url)
            }
        }
    })
]

export const categoryController = {
    categoryList,
    categoryInfo,
    categoryAddGet,
    categoryAddPost,
    categoryDeleteGet,
    categoryDeletePost,
    categoryUpdateGet,
    categoryUpdatePost
}

