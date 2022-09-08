const express = require('express')
const Note = require('./models/note')
const middleware = require('./middleware')

require('dotenv').config()

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)




app.get('/api/notes', (_, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})