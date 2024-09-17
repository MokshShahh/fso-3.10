const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors())
morgan.token('req-body',(req)=>{
  if(req.method==='POST'){
    return JSON.stringify(req.body)
  }
  return ""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

function generatedID(){
  return persons.length+2
}

app.get("/api/persons",(request,response)=>{
    response.send(persons)

})

app.post("/api/persons",(request,response)=>{
  const body=request.body
  if(!body.name || !body.number){
    return response.status(400).send("Name or Number is missing")
  }


  const existingName= persons.find(person => person.name===body.name)
  if(existingName){
    return response.status(400).send("Name aldredy exists")

  }
  body.id=generatedID()
  persons = persons.concat(body)
  response.status(201).send(persons)

})

app.get("/api/persons/:id",(request,response)=>{
    const id=request.params.id
    const person =persons.find(person=>person.id===id)
    if(!person){
        response.status(404).send(`person with id: ${id} does not exist`)
    }
    response.send(person)
})

app.delete("/api/persons/:id",(request,response)=>{
  const id=request.params.id
  persons = persons.filter(person => person.id!==id)
  response.send(`person with id ${id} has been deleted`)
})

app.get("/info",(request,response)=>{
    total=persons.length
    response.send(`phonebook has info for ${total} people<br><br> ${Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})