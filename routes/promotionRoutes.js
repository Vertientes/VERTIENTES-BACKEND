import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { createPromotion, deletePromotion, getPromotions, updatePromotion } from '../controllers/promotionController.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import multer from 'multer'
import { storage } from '../utils/multerStorage.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'

const upload = multer({ storage: storage })

const router = express.Router()

router.post('/new_promotion', upload.single('promotion-image'), validateNotEmptyFields(['description', 'required_quantity', 'discounted_percentage']), verifyJwt, isAdmin, createPromotion)
router.put('/update_promotion/:id',  upload.single('promotion-image'), validateNotEmptyFields(['description', 'required_quantity', 'discounted_percentage']), verifyJwt, isAdmin, updatePromotion)
router.get('/all_promotions', verifyJwt, isAdmin, getPromotions)
router.delete('/delete_promotion/:id', verifyJwt, isAdmin, deletePromotion)

export default router

