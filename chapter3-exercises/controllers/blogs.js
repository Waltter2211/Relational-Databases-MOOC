const express = require('express')
const { Blog } = require('../models/index')
const { blogFinder } = require('../util/middlewares')
const router = express.Router()

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, date: new Date() })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (!req.body.likes) {
      const error = new Error()
      error.name = 'SequelizeValidationError'
      throw error
    }
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router