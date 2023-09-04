const Relationship = require("../models/relationship.model");

// Controller function to get all relationships
exports.getAllRelationships = async (req, res) => {
  try {
    const relationships = await Relationship.find();
    res.status(200).json(relationships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to get relationships of a specific person
exports.getRelationshipsByPersonId = async (req, res) => {
  try {
    const relationships = await Relationship.find({
      $or: [{ person1: req.params.name }, { person2: req.params.name }],
    });
    res.status(200).json(relationships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller function to create a new relationship
exports.addRelationship = async (req, res) => {
  const { person1, person2, relationshipType } = req.body;

  // Validate that person1 and person2 are not the same
  if (person1 === person2) {
    return res.status(400).json({
      message: "A person cannot have a relationship with themselves.",
    });
  }

  // Check existing relationships for person1 and person2
  const existingRelationships1 = await Relationship.find({
    $or: [{ person1 }, { person2: person1 }],
  });
  const existingRelationships2 = await Relationship.find({
    $or: [{ person1: person2 }, { person2 }],
  });

  // Check if the exact same relationship already exists
  const exactSameRelationshipExists = existingRelationships1.some(
    (rel) =>
      (rel.person1 === person1 && rel.person2 === person2) ||
      (rel.person1 === person2 && rel.person2 === person1)
  );

  if (exactSameRelationshipExists) {
    return res
      .status(400)
      .json({ message: "This exact relationship already exists." });
  }

  // Validate based on relationship type
  if (relationshipType === "parent") {
    const parentCount1 = existingRelationships1.filter(
      (rel) => rel.relationshipType === "parent"
    ).length;

    if (parentCount1 >= 2) {
      return res
        .status(400)
        .json({ message: "A person can have at most two parents." });
    }
  } else if (relationshipType === "partner") {
    // You can have zero or more partners, so there's not much to validate here
  } else if (relationshipType === "friend") {
    // You can have multiple friends, so there's not much to validate here either
  } else if (relationshipType === "child") {
    // You can have zero or more children, so no need for validation here either
  } else if (relationshipType === "grandparent") {
    // You can have zero or more grandparents, so no need for validation here
  }

  // If validation passes, create the new relationship
  const newRelationship = new Relationship(req.body);
  try {
    const savedRelationship = await newRelationship.save();
    res.status(201).json(savedRelationship);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Controller function to delete an existing relationship
exports.deleteRelationship = async (req, res) => {
  try {
    await Relationship.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Relationship deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
