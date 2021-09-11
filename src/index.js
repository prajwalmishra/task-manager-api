const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()
const port = process.env.PORT
const userRouter = require('../routers/users')
const taskRouter = require('../routers/tasks')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const multer = require('multer')
const upload = multer({ dest: 'images' })

app.post('/upload', upload.single('upload'), (req,res,next) => {
    res.send()
})


app.listen(port, () => {
    console.log('listening on port ' + port)
})



