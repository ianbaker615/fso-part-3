require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  })
);

// info page
app.get("/info", (req, res) => {
  const date = new Date();
  let numContacts = 0;
  Contact.find({}).then((contacts) => {
    numContacts = contacts.length;
    res.send(
      `<div>
        <p>Phonebook has info for ${numContacts} contacts</p>
        <p>${date}</p>
      </div>`
    );
  });
});

// get all contacts
app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

// get specific contact according to id
app.get("/api/contacts/:id", (req, res) => {
  Contact.findById(req.params.id).then((contact) => {
    res.json(contact);
  });
});

// add a contact
app.post("/api/contacts", (req, res) => {
  const body = req.body;
  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "content missing" });
  }
  const contact = new Contact({
    name: body.name,
    phone: body.phone,
  });
  contact.save().then((savedContact) => {
    res.json(savedContact);
  });
});

// delete a contact
app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
