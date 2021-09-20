const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const app = express()

const userRouter = require('../routers/users')
const taskRouter = require('../routers/tasks')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app