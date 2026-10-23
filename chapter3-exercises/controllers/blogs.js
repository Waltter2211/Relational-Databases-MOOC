const express = require('express')
const { Blog } = require('../models/index')
const router = express.Router()

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()

  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create({...req.body, date: new Date()})
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router