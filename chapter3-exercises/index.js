const express = require('express')
const { connectToDatabase } = require('./util/db')
const { errorHandler } = require('./util/middlewares')
const app = express()

const { PORT } = require('./util/config')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const { syncModels } = require('./models')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  await syncModels()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()