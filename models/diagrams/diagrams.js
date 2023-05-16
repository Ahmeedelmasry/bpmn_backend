const mongoose = require("mongoose");
const diagramModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  diagram: {
    type: Object,
    required: true,
  },
  svg: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

module.exports = mongoose.model("diagrams", diagramModel);
