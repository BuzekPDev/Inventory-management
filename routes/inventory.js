import express from 'express'
import asyncHandler from 'express-async-handler'
import { productController } from '../controllers/productController.js'
import { categoryController } from '../controllers/categoryController.js'
import { editionController } from '../controllers/editionController.js'
import { expansionController } from '../controllers/expansionController.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.get('/', productController.index)

router.get('/product/add', productController.productAddGet)
router.post('/product/add',upload.single('image'), productController.productAddPost)

router.get('/product/:id/delete', productController.productDeleteGet)
router.post('/product/:id/delete', productController.productDeletePost)

router.get('/product/:id/update', productController.productUpdateGet)
router.post('/product/:id/update', productController.productUpdatePost)

router.get('/products', productController.productList)
router.get('/product/:id', productController.productInfo)


router.get('/category/add', categoryController.categoryAddGet)
router.post('/category/add', categoryController.categoryAddPost)

router.get('/category/:id/delete', categoryController.categoryDeleteGet)
router.post('/category/:id/delete', categoryController.categoryDeletePost)

router.get('/category/:id/update', categoryController.categoryUpdateGet)
router.post('/category/:id/update', categoryController.categoryUpdatePost)

router.get('/categories', categoryController.categoryList)
router.get('/category/:id', categoryController.categoryInfo)


router.get('/edition/add', editionController.editionAddGet)
router.post('/edition/add', editionController.editionAddPost)

router.get('/edition/:id/delete', editionController.editionDeleteGet)
router.post('/edition/:id/delete', editionController.editionDeletePost)

router.get('/edition/:id/update', editionController.editionUpdateGet)
router.post('/edition/:id/update', editionController.editionUpdatePost)

router.get('/editions', editionController.editionList)
router.get('/edition/:id', editionController.editionInfo)


router.get('/expansion/add', expansionController.expansionAddGet)
router.post('/expansion/add', expansionController.expansionAddPost)

router.get('/expansion/:id/delete', expansionController.expansionDeleteGet)
router.post('/expansion/:id/delete', expansionController.expansionDeletePost)

router.get('/expansion/:id/update', expansionController.expansionUpdateGet)
router.post('/expansion/:id/update', expansionController.expansionUpdatePost)

router.get('/expansions', expansionController.expansionList)
router.get('/expansion/:id', expansionController.expansionInfo)

export const inventoryRouter = router