const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())


// Tehtävä 3.7
// app.use(morgan('tiny'))

// Tehtävä 3.8.
morgan.token('resp', function (req, res) {return JSON.stringify(req.body) })
const logFormat = ':method :url :resp :status :res[content-length] - :response-time ms'
app.use(morgan(logFormat))

app.use(bodyParser.json())
app.use(express.static('build'))

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

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person
  .findById(id)
  .then(person => {
    if (person) {
      response.json(Person.format(person))
    } else {
      response.status(404).end()
    }      
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.get('/api/persons', (request, response) => {
  Person
  .find({})
  .then(persons => {
    response.json(persons.map(Person.format))
  })
  .catch(error => {
    console.log(error)
  }) 
})

app.get('/info', (request, response) => {
  Person
  .find({})
  .then(persons => {
    let date = new Date()
    let count = persons.length
    response.status(200).send('<p>Puhelinluettelossa on ' + count + ' henkilön tiedot</p><p>'+ date+'</p>')
  })
  .catch(error => {
    console.log(error)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person
  .findByIdAndRemove(id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
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

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
  .save()
  .then(Person.format)
  .then(savedFormattedPerson => {
    response.json(savedFormattedPerson)
  })
  .catch(error => {
    if(error.code === 11000) {
      return response.status(400).json({error: 'Name already exists.'})
    }
    console.log(error)
  })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const id = request.params.id

  const person = {
    name: body.name,
    number: body.number
  }

  Person
  .findOneAndUpdate({ _id: id }, person, { new: true } )
  .then(updatedPerson => {
    response.json(Person.format(updatedPerson))
  })
  .catch(error => {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})