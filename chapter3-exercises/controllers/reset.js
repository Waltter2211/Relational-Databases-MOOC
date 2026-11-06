const express = require('express')
const router = express.Router()
const { sequelize } = require('../util/db')

router.get('/', async (req, res) => {
    res.status(200).end('toimii')
})

router.post('/', async (req, res) => {
    await sequelize.truncate({ cascade: true })
    res.send('deleted')
})

module.exports = router