import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { newOrder } from '../controllers/orderController.js'

const router = express.Router()

router.post('/new_order', verifyJwt, newOrder)

export default router

