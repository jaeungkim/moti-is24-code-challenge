// Importing the mongoose library and setting the strictQuery property to true
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

// Setting the promise library to global.Promise
mongoose.Promise = global.Promise;

// Creating an empty object for our database
const db = {};

// Adding the mongoose library to the database object
db.mongoose = mongoose;

// Adding the product model to the database object
db.person = require("./person.model");
db.relationship = require("./relationship.model");
// Exporting the database object
module.exports = db;
