const express = require('express')
const { Blog, User } = require('../models/index')
const { blogFinder, tokenExtractor } = require('../util/middlewares')
const router = express.Router()
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`
          }
        },
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
      attributes: {
        exclude: ['id', 'password']
      }
    },
    where
  })

  console.log(JSON.stringify(blogs))
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.decodedToken.id, author: req.decodedToken.name, date: new Date() })
    return res.json(blog)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    const correctUser = await User.findOne({ where: { username: req.decodedToken.username } })
    if (correctUser.id != req.blog.userId) {
      const error = new Error()
      error.name = 'NotCorrectUserForDeletionError'
      throw error
    }
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