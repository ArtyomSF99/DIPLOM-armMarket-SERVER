const express =require('express')
const socketIo = require('socket.io')
const http = require('http')
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
const chat_service = require('./service/chat_service')

const PORT = process.env.PORT || 8000
const SOCKET_PORT = process.env.SOCKET_PORT || 5001

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    
})

io.on('connection', (socket) => {
    // console.log(`User connected: ${socket.id} }`);
    socket.on('join', (data) => {
        socket.join(data.senderId + data.receiverId);
      
    });
    socket.on('get_chat_messages', (data) =>{
        console.log(data)
        chat_service.getMessagesById(data.senderId,data.receiverId)
        .then((messages) => io.to(data.senderId + data.receiverId).emit('get_all_messages', messages))
        .catch((error) => console.log(error))
    })
  
    //Handle message event
    socket.on('send_message', (data) => {
      //Insert the message into the database
    //   db.query('INSERT INTO messages (sender_id, receiver_id, message, created_at) VALUES ($1, $2, $3, $4)', [data.sender_id, data.receiver_id, data.message, new Date()], (err, res) => {
    //     if (err) {
    //       console.log(err.stack);
    //     } else {
    //       // Send the message to the recipient
    //       io.to(data.receiver_id).emit('message', data);
    //     }
    //   });
    //socket.emit('get_messages', data);
    console.log(data)
    chat_service.saveMessage(data).then((response) =>  io.to(response.sender_id + response.receiver_id).emit('get_messages', response)).catch((e) =>console.log(e))
   
   });
   
  
    //Handle disconnect event
    socket.on('disconnect', () => {
      
      console.log(`User disconnected: ${socket.id}`);
    });
  }
    );
  
  server.listen(SOCKET_PORT, () => {
    console.log('Server listening on port' + SOCKET_PORT);
  });

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
