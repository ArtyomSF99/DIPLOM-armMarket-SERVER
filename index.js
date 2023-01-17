const express =require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const multer = require('multer');
const fsPromise = require('fs/promises')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const authRouter = require('./routes/auth_routes')
const categoryManagementRouter = require('./routes/category_management_routes')
const productRouter = require('./routes/products_routes')
const userRouter = require('./routes/user_routes')
const errorMiddleware = require('./middlewares/error_middleware')

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
    const folder = decodeURI(req.headers.folder);
    const product = decodeURI(req.headers.product);
    fsPromise.mkdir(path.join(path.join(__dirname, '/uploads', folder), product), { recursive: true })
    .then(() => cb(null, path.join(__dirname, 'uploads', folder, product)))
    .catch(() => {
    fsPromise.mkdir(path.join(__dirname, '/uploads', folder), { recursive: true })
    .then(() => cb(null, path.join(__dirname, 'uploads', folder, product)))
    .catch(e => console.log(e))
    });
    },
    filename: (req, file, cb) => {
    cb(null, `${Date.now().toString().replace(/:/g, '-')}.${file.originalname}`);
    },
    });
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }
 

const PORT = process.env.PORT || 8000

const app = express()
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname + "/uploads"));

app.get('/hello', (req,res) => {
    res.send('Hello, server is worked')
})
app.use('/', authRouter)
app.use('/', categoryManagementRouter)
app.use('/', multer({storage:storageConfig, fileFilter: fileFilter}).any(), productRouter)
app.use('/', userRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
    
})
