const User = require('../models/user')

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const user = await User.findByToken(token)
        
        if (!user) {
            throw new Error('Authentication failed')
        }

        req.user = user
        req.token = token
        next()
    } catch (err) {
        res.status(401).json({ error: 'Authentication failed' })
    }
}

module.exports = {
    authenticateUser
}