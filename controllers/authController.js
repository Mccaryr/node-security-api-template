const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports.signup_post = async (req, res) => {
    const { user_email, password } = req.body

    try {
       const user = await User.create({user_email, password})
       const token = createToken(user._id);
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
       res.status(201).json({user: user._id})
    } catch(err) {
        res.status(400).send({message: err.message})
    }
}

const maxAge = 1 * 24 * 60 * 60

const createToken = (id) => {
    return jwt.sign({ id }, 'robs super secret secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.send('New signup page')
}

module.exports.login_post = async (req, res) => {
    const { user_email, password } = req.body

    try {
        const user = await User.login(user_email, password)
        const token = createToken(user._id);
       res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
       res.status(201).json({user: user._id})
    } catch (error) {
        res.status(400).json(error.message)
    }
}

module.exports.logout_get = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})

}