const Person = require("../models/person.model");
const Relationship = require("../models/relationship.model");
// Controller function to get all people
exports.getAllPersons = async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get a specific person by their ID
exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to create a new person
exports.addPerson = async (req, res) => {
  const newPerson = new Person(req.body);
  try {
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Controller function to update an existing person
exports.updatePerson = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePerson = async (req, res) => {
  try {
    const personId = req.params.id;

    // Fetch the person's name using the person ID
    const person = await Person.findById(personId);
    const personName = person ? person.name : null;

    if (!personName) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Delete all relationships associated with this person's name
    await Relationship.deleteMany({
      $or: [{ person1: personName }, { person2: personName }],
    });

    // Delete the person
    await Person.findByIdAndDelete(personId);

    res
      .status(200)
      .json({ message: "Person and associated relationships deleted" });
  } catch (err) {
    console.error("Error while deleting person: ", err); // Debug line
    res.status(500).json({ message: err.message });
  }
};
