const { Blog } = require('../models/index')

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

  next(error)
}

module.exports = { blogFinder, errorHandler }