// Import dependencies
const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const Person = require("./app/models/person.model");
const Relationship = require("./app/models/relationship.model");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const fs = require("fs").promises;

// Configuration
const port = 3030;
const corsOptions = { credentials: true, origin: ["http://localhost:3000"] };
let connectionString = "";
if (process.env.NODE_ENV === "production") {
  connectionString = "mongodb://mongo:27017/is24r-jaeungkim-fullstack-db";
} else {
  connectionString = "mongodb://127.0.0.1:27017/is24r-jaeungkim-fullstack-db";
}
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "jaeungkim-fullstack API",
      version: "1.0.0",
      description:
        "API documentation for jaekim's is24r-fullstack competition application",
    },
    servers: [
      {
        url: "http://localhost:3030",
      },
    ],
  },
  apis: ["./app/routes/person.routes.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Create and configure a new Express app instance
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

async function seedDatabase() {
  const personsData = [
    { name: "Alice", age: 30, contactDetails: "alice@example.com" },
    { name: "Bob", age: 40, contactDetails: "bob@example.com" },
    { name: "Charlie", age: 25, contactDetails: "charlie@example.com" },
    { name: "Dave", age: 35, contactDetails: "dave@example.com" },
    { name: "Eve", age: 45, contactDetails: "eve@example.com" },
    { name: "Fiona", age: 50, contactDetails: "fiona@example.com" },
    { name: "George", age: 55, contactDetails: "george@example.com" },
    { name: "Helen", age: 60, contactDetails: "helen@example.com" },
    { name: "Ivy", age: 65, contactDetails: "ivy@example.com" },
    { name: "Jack", age: 70, contactDetails: "jack@example.com" },
    { name: "Karen", age: 22, contactDetails: "karen@example.com" },
    { name: "Leo", age: 48, contactDetails: "leo@example.com" },
    { name: "Mia", age: 26, contactDetails: "mia@example.com" },
    { name: "Ned", age: 32, contactDetails: "ned@example.com" },
    { name: "Olivia", age: 29, contactDetails: "olivia@example.com" },
    { name: "Paul", age: 27, contactDetails: "paul@example.com" },
    { name: "Quincy", age: 33, contactDetails: "quincy@example.com" },
    { name: "Rachel", age: 52, contactDetails: "rachel@example.com" },
    { name: "Steve", age: 53, contactDetails: "steve@example.com" },
    { name: "Tracy", age: 54, contactDetails: "tracy@example.com" },
  ];

  const savedPersons = [];

  for (const personData of personsData) {
    const person = new Person(personData);
    const savedPerson = await person.save();
    savedPersons.push(savedPerson);
  }

  const relationshipsData = [
    // Parent-Child Relationships
    { person1: savedPersons[0].name, person2: savedPersons[1].name, relationshipType: "parent" },
    { person1: savedPersons[1].name, person2: savedPersons[0].name, relationshipType: "child" },
    
    { person1: savedPersons[0].name, person2: savedPersons[4].name, relationshipType: "parent" },
    { person1: savedPersons[4].name, person2: savedPersons[0].name, relationshipType: "child" },
    
    { person1: savedPersons[1].name, person2: savedPersons[2].name, relationshipType: "parent" },
    { person1: savedPersons[2].name, person2: savedPersons[1].name, relationshipType: "child" },
    
    { person1: savedPersons[1].name, person2: savedPersons[3].name, relationshipType: "parent" },
    { person1: savedPersons[3].name, person2: savedPersons[1].name, relationshipType: "child" },
    
    { person1: savedPersons[5].name, person2: savedPersons[6].name, relationshipType: "parent" },
    { person1: savedPersons[6].name, person2: savedPersons[5].name, relationshipType: "child" },
    
    { person1: savedPersons[7].name, person2: savedPersons[5].name, relationshipType: "parent" },
    { person1: savedPersons[5].name, person2: savedPersons[7].name, relationshipType: "child" },
    
    { person1: savedPersons[8].name, person2: savedPersons[7].name, relationshipType: "parent" },
    { person1: savedPersons[7].name, person2: savedPersons[8].name, relationshipType: "child" },
    
    { person1: savedPersons[8].name, person2: savedPersons[9].name, relationshipType: "parent" },
    { person1: savedPersons[9].name, person2: savedPersons[8].name, relationshipType: "child" },
    
    { person1: savedPersons[10].name, person2: savedPersons[11].name, relationshipType: "parent" },
    { person1: savedPersons[11].name, person2: savedPersons[10].name, relationshipType: "child" },
    
    { person1: savedPersons[11].name, person2: savedPersons[12].name, relationshipType: "parent" },
    { person1: savedPersons[12].name, person2: savedPersons[11].name, relationshipType: "child" },
    
    { person1: savedPersons[12].name, person2: savedPersons[13].name, relationshipType: "parent" },
    { person1: savedPersons[13].name, person2: savedPersons[12].name, relationshipType: "child" },
    
    { person1: savedPersons[13].name, person2: savedPersons[14].name, relationshipType: "parent" },
    { person1: savedPersons[14].name, person2: savedPersons[13].name, relationshipType: "child" },
    
    { person1: savedPersons[14].name, person2: savedPersons[15].name, relationshipType: "parent" },
    { person1: savedPersons[15].name, person2: savedPersons[14].name, relationshipType: "child" },
    
    { person1: savedPersons[15].name, person2: savedPersons[16].name, relationshipType: "parent" },
    { person1: savedPersons[16].name, person2: savedPersons[15].name, relationshipType: "child" },
    
    { person1: savedPersons[16].name, person2: savedPersons[17].name, relationshipType: "parent" },
    { person1: savedPersons[17].name, person2: savedPersons[16].name, relationshipType: "child" },
    
    { person1: savedPersons[17].name, person2: savedPersons[18].name, relationshipType: "parent" },
    { person1: savedPersons[18].name, person2: savedPersons[17].name, relationshipType: "child" },
    
    { person1: savedPersons[18].name, person2: savedPersons[19].name, relationshipType: "parent" },
    { person1: savedPersons[19].name, person2: savedPersons[18].name, relationshipType: "child" },


    // Partner Relationships
    { person1: savedPersons[2].name, person2: savedPersons[3].name, relationshipType: "partner" },
    { person1: savedPersons[4].name, person2: savedPersons[5].name, relationshipType: "partner" },
    { person1: savedPersons[6].name, person2: savedPersons[10].name, relationshipType: "partner" },
    { person1: savedPersons[12].name, person2: savedPersons[13].name, relationshipType: "partner" },
    { person1: savedPersons[15].name, person2: savedPersons[17].name, relationshipType: "partner" },

    // Friend Relationships
    { person1: savedPersons[6].name, person2: savedPersons[9].name, relationshipType: "friend" },
    { person1: savedPersons[10].name, person2: savedPersons[19].name, relationshipType: "friend" },
    
    // Grandparent-Grandchild Relationships (derived)
    { person1: savedPersons[7].name, person2: savedPersons[6].name, relationshipType: "grandparent" },
    { person1: savedPersons[8].name, person2: savedPersons[5].name, relationshipType: "grandparent" },
    { person1: savedPersons[0].name, person2: savedPersons[2].name, relationshipType: "grandparent" },
    { person1: savedPersons[0].name, person2: savedPersons[3].name, relationshipType: "grandparent" },
    { person1: savedPersons[4].name, person2: savedPersons[2].name, relationshipType: "grandparent" },
    { person1: savedPersons[4].name, person2: savedPersons[3].name, relationshipType: "grandparent" },
    { person1: savedPersons[10].name, person2: savedPersons[12].name, relationshipType: "grandparent" },
    { person1: savedPersons[11].name, person2: savedPersons[13].name, relationshipType: "grandparent" },
    { person1: savedPersons[12].name, person2: savedPersons[14].name, relationshipType: "grandparent" },
    { person1: savedPersons[13].name, person2: savedPersons[15].name, relationshipType: "grandparent" },
    { person1: savedPersons[15].name, person2: savedPersons[16].name, relationshipType: "grandparent" },
    { person1: savedPersons[16].name, person2: savedPersons[17].name, relationshipType: "grandparent" },
    { person1: savedPersons[17].name, person2: savedPersons[18].name, relationshipType: "grandparent" },
    { person1: savedPersons[18].name, person2: savedPersons[19].name, relationshipType: "grandparent" },
  ];

  for (const relationshipData of relationshipsData) {
    const relationship = new Relationship(relationshipData);
    await relationship.save();
  }
}


// Connect to the MongoDB database and seed if necessary
async function connectToDatabase() {
  try {
    await db.mongoose.connect(connectionString, mongoOptions);
    console.log("Successfully connected to MongoDB");

    const personsCount = await Person.countDocuments({});
    const relationshipsCount = await Relationship.countDocuments({});

    if (personsCount === 0 && relationshipsCount === 0) {
      // Call the seed function here if no records exist
      await seedDatabase();
      console.log("Database seeded successfully");
    } else {
      console.log("Database already seeded. Skipping...");
    }
  } catch (error) {
    console.error("Connection error", error);
    process.exit(1);
  }
}

connectToDatabase();

// Define a route to display a welcome message
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to jaekim's ISL 24R-fullstack competition application.",
  });
});

// Include the routes
require("./app/routes/person.routes")(app);
require("./app/routes/relationship.routes")(app);

// Start listening for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
