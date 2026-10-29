const { Blog } = require('../models/index')
const { SECRET } = require('../util/config')
const jwt = require('jsonwebtoken')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    if (!req.blog) {
      const error = new Error()
      error.name = 'BlogNotFoundError'
      throw error
    }
    next()
  } catch (error) {
    next(error)
  }
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'TypeError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'BlogNotFoundError') {
    return response.status(404).send({ error: 'blog with this id was not found' })
  }

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).send({ error: 'blog body has a wrong format' })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: 'request url is wrong format' })
  }

  if (error.name === 'UserCreationError') {
    if (error.errors[0].type === 'unique violation')
      return response.status(400).send({ error: 'email is not unique' })
    else if (error.errors[0].type === 'Validation error')
      return response.status(400).send({ error: 'username must be a valid email address' })
  }

  next(error)
}

module.exports = { blogFinder, errorHandler, tokenExtractor }