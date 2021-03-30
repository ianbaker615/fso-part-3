const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    phone: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    phone: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    phone: "39-23-6423122",
    id: 4,
  },
];

// info page
app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>`
  );
});

// get all persons
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// get specific person according to id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)``;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

// add a person
const generateId = () => {
  return Math.floor(Math.random() * 1000);
};
app.post("/api/persons", (req, res) => {
  const body = req.body;

  // validation
  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "content missing" });
  }
  const name_array = persons.map((person) => person.name);
  if (name_array.includes(body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    phone: body.phone,
    id: generateId(),
  };

  persons = persons.concat(person);
  res.json(person);
});

// delete a person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
