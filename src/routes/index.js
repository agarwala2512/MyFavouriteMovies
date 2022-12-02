const express = require('express')
const router = express.Router()

const userRoutes = require('./user')
const movieRouter = require('./movies')

router.use('/', userRoutes)
router.use('/movies', movieRouter)

module.exports = router