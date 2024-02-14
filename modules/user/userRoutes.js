import express from 'express'
import { verifyJwt } from '../../middlewares/verifyJwt.js'
import { isAdmin } from '../../middlewares/isAdmin.js'
import { getAllUsers, updateUserData } from './userController.js'
import multer from 'multer'
import {storage} from '../../utils/multerStorage.js'
import { validateNotEmptyFields } from '../../middlewares/validateNotEmptyFields.js'

const router = express.Router()


const upload = multer({ storage: storage })
//ruta de usuarios
//api/all_users

router.get('/all_users', verifyJwt, isAdmin, getAllUsers)
router.put('/update_user_data/:id', upload.single('house_img'), validateNotEmptyFields([]), /* verifyJwt */ updateUserData)

export default router

