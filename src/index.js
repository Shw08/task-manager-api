const express = require('express')
const User = require('./model/user')
const Task = require('./model/task')
const task = require('./model/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

require('./db/mongoose')


const app = express()
const port = process.env.PORT



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () =>{
    console.log('Server is up on port : ' + port)
})

