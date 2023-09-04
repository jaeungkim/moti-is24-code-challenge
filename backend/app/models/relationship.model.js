const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relationshipSchema = new mongoose.Schema({
  person1: { type: String, ref: "Person", required: true },
  person2: { type: String, ref: "Person", required: true },
  relationshipType: {
    type: String,
    enum: ["parent", "grandparent", "partner", "child", "friend"],
    required: true,
  },
});

module.exports = mongoose.model("Relationship", relationshipSchema);
