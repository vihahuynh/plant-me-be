const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('./../models/user')

usersRouter.post('/', async (request, response, next) => {
    try {
        const { username, email, password } = request.body

        const existingUser = await User.findOne({ username })
        const existingEmail = await User.findOne({ email })

        if (password.length < 8) {
            return response.status(400).json({
                error: 'password must contain at least 8 characters'
            })
        }

        if (existingUser) {
            return response.status(400).json({
                error: 'username must be unique'
            })
        }

        if (existingEmail) {
            return response.status(400).json({
                error: 'Email address must be unique'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            email,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (err) {
        next(err)
    }
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('notes', { content: 1, date: 1 })
    response.json(users)
});

module.exports = usersRouter