// imports
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const app = express();
const PORT = process.env.PORT;

// import database
const db = require("./src/database")

//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))

// set template engines
app.set("view engine", "ejs");

app.use(
      cors({
        credentials: true,
      })
)
  
app.use(cookieParser(process.env.COOKIE_SECRET))

// Express session
app.use(
      session({
          secret: 'secret',
          resave: true,
          saveUninitialized: true,
      })
  )

// Connect flash
app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// call routes
const routes = require("./src/routes");
app.use("/", routes)

// no matching route called
app.get("*", (req, res) => {
      res.send("Page Not Found!");
      //res.render('add_movie')
});

app.listen(PORT, () =>{
      console.log(`Server started at http://localhost:${PORT}`);
});