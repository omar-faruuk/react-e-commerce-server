const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

dotenv.config()


mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log('database connected successfully'))
.catch((err)=> console.log(err))

app.use(express.json())
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)


app.listen(5000,()=>{
    console.log('app listening on port 5000');
})