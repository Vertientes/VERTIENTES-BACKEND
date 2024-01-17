import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { deleteProduct, getProducts, newProduct, updateProduct } from '../controllers/productController.js'
import { isAdmin } from '../middlewares/isAdmin.js'

const router = express.Router()

router.post('/new_product', verifyJwt, isAdmin, newProduct)
router.get('/all_products', verifyJwt, isAdmin, getProducts)
router.put('/update_product/:id', verifyJwt, isAdmin, updateProduct)
router.delete('/delete_product/:id', verifyJwt, isAdmin, deleteProduct)

export default router

