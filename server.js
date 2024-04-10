require('dotenv').config();
const path = require('path')
const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/auth')
const cookieParser = require('cookie-parser')


mongoose.connect(process.env.MONGO_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to Database'))

//middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser());

const userRouter = require('./routes/user')
app.use('/user', userRouter)

app.use('/auth', authRouter)

const dogRouter = require('./routes/dog');
const { requireAuth } = require('./middleware/authMiddleware');
app.use('/dogs', requireAuth, dogRouter)

//Allows access to all client files from server
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/client/build')));
    
    //Serves up client files from server
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
} 


app.use("*", (req, res) => res.status(404).json({error: "Not Found"}))
app.listen(PORT, () => console.log('Server Started'))