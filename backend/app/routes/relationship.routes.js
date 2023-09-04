const relationshipController = require("../controllers/relationship.controller");

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

  // GET /api/relationships: Fetch all relationships
  app.get("/api/relationships", relationshipController.getAllRelationships);

  // GET /api/relationships/:personId: Fetch relationships of a specific person
  app.get(
    "/api/relationships/:personId",
    relationshipController.getRelationshipsByPersonId
  );

  // POST /api/relationships: Create a new relationship
  app.post("/api/relationships", relationshipController.addRelationship);

  // DELETE /api/relationships/:id: Delete a relationship
  app.delete(
    "/api/relationships/:id",
    relationshipController.deleteRelationship
  );
};
