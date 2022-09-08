const express = require("express")
const app = express()

app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)

let notes = [{
    name: "Nemo"
}, {
    name: "Damian"
}]

app.get('/', (request, response) => {
    response.send("<h1>Nemo</h1>")
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})