const express = require("express");
const router = express.Router();
const {
  createNewDiagram,
  getUserDiagrams,
  deleteDiagram,
  getSingleDiagram,
  updateDiagram,
} = require("../../controls/diagrams/diagrams");

//Create new Diagram
router.post("/create", createNewDiagram);
router.get("/get-all/:uid/:page", getUserDiagrams);
router.get("/get-one/:diagramId", getSingleDiagram);
router.post("/update-one/:diagramId", updateDiagram);
router.delete("/delete-diagram/:diagramId", deleteDiagram);

module.exports = router;
