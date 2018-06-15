const mongoose = require('mongoose')
const DB = require('./db.js');
const username = DB.username
const password = DB.password
const dburl = DB.url
const _name = process.argv[2]
const _number = process.argv[3]


const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: _name,
  number: _number
})

const addPerson = () => {
  console.log('Lisätään henkilö ' + _name + ' numero ' + _number + ' tietokantaan.')
  person
  .save()
  .then(response => {
    console.log('Henkilö tallennettu')
    mongoose.connection.close()
  })
}

const getPersons = () => {
  Person
  .find({})
  .then(result => {
    console.log("Puhelinluettelo: ")
    result.forEach(person => {
      console.log(person.name,person.number)
    })
    mongoose.connection.close()
  })
}

const url = 'mongodb://'+username+':'+password+dburl
mongoose.connect(url)

if(_name === undefined || _number === undefined) {
  getPersons()
} else {
  addPerson()
}
