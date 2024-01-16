import express from 'express'
import { logOut, signIn, signUp, userProfile } from '../controllers/authController.js'
import { verifyJwt } from '../middlewares/verifyJwt.js'

const router = express.Router()


///auth route
//api/signup
router.post('/signup', signUp)
//api/signin
router.post('/signin', signIn)
//api/logout
router.post('/logout', logOut)

router.get('/profile', verifyJwt, userProfile)

export default router

