import express from 'express'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import { getAllUsers } from '../controllers/userController.js'

const router = express.Router()


//ruta de usuarios
//api/all_users

router.get('/all_users', verifyJwt, isAdmin, getAllUsers)

export default router

