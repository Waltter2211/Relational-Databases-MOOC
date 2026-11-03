const express = require('express')
const { Blog } = require('../models/index')
const router = express.Router()
const { Sequelize } = require('sequelize')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'blogs'],
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[Sequelize.fn('SUM', Sequelize.col('likes')), 'DESC']],
    raw: true
  })
  res.json(blogs)
})

module.exports = router