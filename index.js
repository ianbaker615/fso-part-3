require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
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

//
// CREATE
//

// add a contact
app.post("/api/contacts", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "content missing" });
  }
  const contact = new Contact({
    name: body.name,
    phone: body.phone,
  });
  contact
    .save()
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch((error) => next(error));
});

//
// READ
//

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
app.get("/api/contacts/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//
// UPDATE
//

// update a contact
app.put("/api/contacts/:id", (req, res, next) => {
  const updatedContact = {
    phone: req.body.phone,
  };
  // enable validation on mongoose update operations
  const opts = { runValidators: true, context: "query", new: true };
  Contact.findOneAndUpdate({ _id: req.params.id }, updatedContact, opts)
    .then((updatedContact) => {
      res.json(updatedContact.toJSON());
    })
    .catch((error) => {
      next(error);
    });
});

//
// DELETE
//

// delete a contact
app.delete("/api/contacts/:id", (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

//
// ERROR HANDLING
//

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
// handler of requests w unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(404).send({ error: "incorrectly formatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
// handler of requests with errors as result
app.use(errorHandler);

//
// SERVER SETUP
//

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
