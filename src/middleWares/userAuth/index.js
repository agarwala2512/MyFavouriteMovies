const jwt = require('jsonwebtoken')
const pool = require("../../database");

const userAuth = async (req, res, next) => {
    try {
        let token = req.cookies.authorization
        if (!token) {
            throw new Error('No authorization token')
        }
        let data = jwt.verify(token, process.env.JWT_SECRET)
        if (!data) throw new Error('Invalid Token')

        let app_user = await pool.query(
            "SELECT * FROM app_user WHERE id = $1",
            [data.userId]
        );

        req.app_user = app_user.rows[0]
        next()
    } catch (error) {
        console.log(error) 
        res.redirect("/login")
    }
}


module.exports = userAuth