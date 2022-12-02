const bcrypt = require("bcrypt")

const pool = require("../../database");
const generateAuthToken = require("../../utils/generateAuthToken")
const moment = require("moment")

const userController = {

    // 1) homePage
    homePage : async (req, res) => {
        
        try {

            const movies = await pool.query(
                "SELECT * FROM movie WHERE app_user_id = $1 ORDER BY id",
                [ req.app_user.id  ]
            )

            const movies_formated = await movies.rows.map(row=>{
                return { ...row, release_date : moment(row.release_date).format("MMM Do YYYY") }
            })
            req.flash('success_msg', 'Welcome To our Application !!')
            
            res.render("index", { ...req.app_user , movies : movies_formated })
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Log in Again!')
            res.redirect("/")
        }
    },

    // 2) loginPage
    loginPage : async (req, res) => { 
         res.render("login")
    },

    
    // 3) registerPage
    registerPage : async (req, res) => {
        res.render("register")
    },
     
    // 2) logInUser
    loginUser: async (req, res) => {
        
        try {
            const { email , password } = req.body

            const existUser = await pool.query(
                "SELECT * FROM app_user WHERE email = $1",
                [email]
            )


            if (existUser.rows.length === 0) {

                req.flash('error_msg', 'Invalid Credentials!!')

                return res.redirect("/login")
            }

            const validPassword = await bcrypt.compare(
                password,
                existUser.rows[0].password
            );

            if (!validPassword) {
                req.flash('error_msg', 'Invalid Credentials!!')
                return res.redirect("/login")
            }
            const jwtToken = await generateAuthToken( existUser.rows[0].id , existUser.rows[0].email )

            res.cookie('authorization', jwtToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
            })

            req.flash('success_msg', 'Welcome To our Application !!')

            res.redirect("/")
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Log in Again!')
            res.redirect("/login")
        }
    },

    // 3) RegisterUser
    registerUser: async (req, res) => {

        try {
            const { name , email , password } = req.body

            const existUser = await pool.query(
                "SELECT * FROM app_user WHERE email = $1",
                [email]
            );

            if( existUser.rows.length !== 0 ){

                req.flash('error_msg', 'User Already Exists!!')
                return res.redirect("/login")
            }

            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(password, salt);

            const newUser = await pool.query(
                "INSERT INTO app_user( name , email , password ) VALUES( $1 , $2 , $3 ) RETURNING *",
                [ name , email , bcryptPassword  ]
            );

            console.log( newUser.rows )

            const jwtToken = await generateAuthToken( newUser.rows[0].id , newUser.rows[0].email )

            res.cookie('authorization', jwtToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
            })

            req.flash('success_msg', 'Welcome To our Application !!')
             
            res.redirect("/")
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Register in Again!')
            res.redirect("/login")
        }        
    },

    // 4) LogoutUser
    logOutUser: async (req, res) => {

        try {
            res.clearCookie('authorization')
            req.flash('success_msg', 'Successfully Logged Out !!')
            res.redirect("/login")
        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Some Error Occured! Please Try Again!')
            res.redirect("/login")            
        }
    }
}

module.exports = userController