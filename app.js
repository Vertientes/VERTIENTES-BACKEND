import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config.js'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/error.js'
import { ErrorResponse } from './utils/errorResponse.js'
//import routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import promotionRoutes from './routes/promotionRoutes.js'
import { dbConnect } from './utils/dbConnect.js'


//db
dbConnect()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', orderRoutes)
app.use('/api', productRoutes)
app.use('/api', promotionRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Server on port', PORT)
})