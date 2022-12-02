const jwt = require('jsonwebtoken')

const generateAuthToken = async function (id, email) {
  
    const token = jwt.sign(
        { userId: id, email },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    )

    return token
}

module.exports = generateAuthToken