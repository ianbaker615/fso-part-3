const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Provide password as argument: node mongo.js <password>");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@fso.zfkid.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  id: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
} else {
  const contact = new Contact({
    name: process.argv[3],
    phone: process.argv[4],
  });

  contact.save().then((result) => {
    console.log(`Added ${contact.name} number ${contact.phone} to phonebook`);
    mongoose.connection.close();
  });
}
