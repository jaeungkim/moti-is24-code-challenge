const personController = require("../controllers/person.controller");

module.exports = (app) => {
  // Set headers for CORS and caching
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Cache-Control", "no-store,no-cache,must-revalidate");
    next();
  });

  // GET /api/people: Fetch all people and their relationships.
  app.get("/api/person", personController.getAllPersons);
  // GET /api/person/:id: Fetch a specific person by their ID.
  app.get("/api/person/:id", personController.getPersonById);
  // POST /api/people: Create a new person.
  app.post("/api/person", personController.addPerson);
  // PUT /api/people/:id: Update an existing person.
  app.put("/api/person/:id", personController.updatePerson);
  // DELETE /api/people/:id: Delete a person and their relationships.
  app.delete("/api/person/:id", personController.deletePerson);
};
