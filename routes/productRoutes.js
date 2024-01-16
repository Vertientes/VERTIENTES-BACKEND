import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { newProduct } from '../controllers/productController.js'

const router = express.Router()

router.post('/new_product', verifyJwt, newProduct)

export default router

