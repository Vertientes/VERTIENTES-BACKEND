import express from 'express'
import 'dotenv/config.js'
import morgan from 'morgan'
import cors from 'cors'
import { errorHandler } from './middlewares/error.js'

//import routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import promotionRoutes from './routes/promotionRoutes.js'
import visitRoutes from './routes/visitRoutes.js'
import requestRoutes from './routes/requestRoutes.js'
import deliveryRoutes from './routes/deliveryRoutes.js'
import { dbConnect } from './utils/dbConnect.js'


//db
dbConnect()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', orderRoutes)
app.use('/api', productRoutes)
app.use('/api', promotionRoutes)
app.use('/api', visitRoutes)
app.use('/api', requestRoutes)
app.use('/api', deliveryRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log('Server on port', PORT)
})