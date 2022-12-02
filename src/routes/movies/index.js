const router = require('express').Router()

const { userAuth } = require("../../middleWares")
const { movieController } = require("../../controllers")
const { addMovie , editMovieById , deleteMovieById , addMoviePage, editMovieByIdPage } = movieController

router.get("/add", userAuth , addMoviePage )
router.post("/add", userAuth , addMovie)
router.get("/edit/:_id", userAuth , editMovieByIdPage)
router.post("/edit/:_id", userAuth , editMovieById)
router.delete("/delete/:_id", userAuth , deleteMovieById)

module.exports = router