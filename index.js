const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
  {
    name: "Arto Hellas",
    number : "040-123456",
    id : 1
  },
  {
    name: "Martti Tienari",
    number : "040-123456",
    id : 2
  },
  {
    name: "Arto Järvinen",
    number : "040-123456",
    id : 3
  },
  {
    name: "Lea Kutvonen",
    number : "040-123456",
    id : 4
  },
]

const PORT = 3001

const nameExists = (name) => {
  const person = persons.find(person => person.name === name)
  if ( person ) {
    return true
  } else {
    return false
  }
}

const generateId = () => {
  let id = Math.random() * 2000000
  return Number(id.toFixed(0))
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  let date = new Date()
  let count = persons.length
  response.send('<p>Puhelinluettelossa on ' + count + ' henkilön tiedot</p><p>'+ date+'</p>')
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body 
  const name = body.name
  const number = body.number 

  if (name === undefined) {
    return response.status(400).json({error: 'Name is missing.'})
  }
  if (number === undefined) {
    return response.status(400).json({error: 'Number is missing.'})
  }
  if (nameExists(name)) {
    return response.status(400).json({error: 'Name already exists.'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  response.json(person)
})
