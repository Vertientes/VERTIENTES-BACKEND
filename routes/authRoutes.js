import express from 'express'
import { logOut, signIn, signUp, userProfile } from '../controllers/authController.js'
import { verifyJwt } from '../middlewares/verifyJwt.js'
import { validateEmailExists } from '../middlewares/validateEmailExists.js'
import { validateNotEmptyFields } from '../middlewares/validateNotEmptyFields.js'
import { validateEmail } from '../middlewares/validateEmail.js'

const router = express.Router()





///auth route
//api/signup
router.post('/signup', /* validateNotEmptyFields(['firstName', 'lastName', 'email', 'password', 'address.*']), validateEmail(), */ validateEmailExists, signUp)
//api/signin
router.post('/signin', validateNotEmptyFields(['email', 'password']), validateEmail(),  signIn)
//api/logout
router.post('/logout', logOut)

router.get('/profile', verifyJwt, userProfile)

export default router

