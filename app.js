import express, { Router } from 'express'
import createError from 'http-errors'
import { fileURLToPath } from 'url'
import { dirname } from 'path' 
import { configDotenv } from 'dotenv'
import { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import asyncHandler from 'express-async-handler'

import * as cloudinary from 'cloudinary'
import mongoose from 'mongoose'
import { inventoryRouter } from './routes/inventory.js'
import { indexRouter } from './routes/index.js'

configDotenv()

cloudinary.v2.config({
  secure:true,
  cloud_name:'dre2sqt0s',
  api_key:'264568238264485',
  api_secret:'HVG4cgJtR6qccEE9sd03iswTGug'
})

const app = express()
const port = 3000
const mongoDB = process.env.MONGODB

connectToMongo().catch(err => console.log(err))

async function connectToMongo () {
  // replace placeholder database name
  mongoose.connect(mongoDB, {dbName: 'InventoryMGMT'}) 
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.set('view engine', 'ejs')

app.use(urlencoded())
app.use(cookieParser())

app.use(express.static(__dirname + '/public'))

app.use('/', indexRouter)
app.use('/inventory', inventoryRouter)

app.get('/' , (req, res) => {

  console.log(`http://localhost:${port}`)

  res.render('pages/index')

}).listen(port)