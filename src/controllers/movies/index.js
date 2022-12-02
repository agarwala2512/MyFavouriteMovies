const e = require("express");
const pool = require("../../database");

const movieController = {
     
    // 1) addMoviePage
    addMoviePage: async (req, res)=>{

        try {
            
            res.render("add_movie", {
                ...req.app_user ,
                title : "Add Movie",
                movie : {},
                postUrl : `/movies/add/`
            })
        } catch (error) {
            
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Try Again!')
            res.redirect("/")
        }
    },

    // 1) addMovie
    addMovie: async (req, res) => {
        
        try {

            console.log( req.body , req.app_user.id  )

            const {
                name,
                rating,
                genre,
                release_date 
            } = req.body

            const casts = req.body.movie_cast.split(",")
            
            const newMovie = await pool.query(
                "INSERT INTO movie( name , rating , movie_cast , genre , release_date , app_user_id ) VALUES( $1 , $2 , $3 , $4 , $5 , $6 ) RETURNING *",
                [ name , rating , casts , genre , release_date , req.app_user.id  ]
            )
            req.flash('success_msg', 'New Movie Added!')
            res.redirect("/")
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Try Again!')
            res.redirect("/")
        }
    },

    editMovieByIdPage :  async (req, res)=>{

        try {
            
            const movie = await pool.query(
                "SELECT * FROM movie WHERE id = $1",
                [ req.params._id  ]
            )

            movie.rows[0].movie_cast =  movie.rows[0].movie_cast?.reduce((curr, cast)=>{
                  return curr + cast + ","
            },"").slice(0, -1);

            console.log( movie.rows[0] )

            res.render("add_movie", {
                ...req.app_user ,
                title : "Edit Movie",
                movie : movie.rows[0],
                postUrl : `/movies/edit/`+ movie.rows[0].id
            })
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Try Again!')
            res.redirect("/")
        }
    },


    // 2) editMovieById
    editMovieById: async (req, res) => {
    
        try {
            
            console.log( "editMovieById" , req.body )
            const {
                name,
                rating,
                genre,
                release_date 
            } = req.body

            const casts = req.body.movie_cast.split(",")

            const movie = await pool.query(
                "UPDATE movie SET name = $1 , rating = $2 , movie_cast = $3 , genre = $4 , release_date = $5 WHERE id = $6 RETURNING *",
                [ name , rating , casts , genre , release_date , req.params._id  ]
            )
            req.flash('success_msg', 'Movie Successfully Edited!')
            res.redirect("/")
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Try Again!')
            res.redirect("/")
        }
    },

    // 5) deleteMovieById
    deleteMovieById: async (req, res) => {

        try {

            console.log(  "delete movie" )

            const movies = await pool.query(
                "DELETE FROM movie WHERE id = $1",
                [ req.params._id ]
            )
            req.flash('success_msg', 'Movie Successfully Deleted!')
            res.redirect("/")
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Try Again!')
            res.redirect("/")
        }
    }
}

module.exports = movieController