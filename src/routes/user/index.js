const router = require('express').Router()
const { userController } = require("../../controllers")

const { loginUser , registerUser , logOutUser, homePage , loginPage , registerPage } = userController

const { userAuth } = require("../../middleWares") 
 
router.get("/" , userAuth,  homePage)
router.get("/login", loginPage)
router.get("/register", registerPage)
router.post("/login", loginUser)
router.post("/register", registerUser)
router.get("/logout", userAuth , logOutUser)

module.exports = router