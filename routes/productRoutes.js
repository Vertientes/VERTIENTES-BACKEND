import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { deleteProduct, getProducts, newProduct, updateProduct } from '../controllers/productController.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import multer from 'multer'
import { storage } from '../utils/multerStorage.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'

const upload = multer({ storage: storage })
const router = express.Router()

router.post('/new_product', upload.single('product-image'), validateNotEmptyFields(['name', 'price', 'type','description']), verifyJwt, isAdmin, newProduct)
router.get('/all_products', verifyJwt, getProducts)
router.put('/update_product/:id',  upload.single('product-image'), validateNotEmptyFields(['name', 'price', 'type', 'description']), verifyJwt, isAdmin, updateProduct)
router.delete('/delete_product/:id', verifyJwt, isAdmin, deleteProduct)

export default router

