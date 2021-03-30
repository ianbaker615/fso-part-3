const express = require("express");
const app = express();

app.use(express.json());

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
