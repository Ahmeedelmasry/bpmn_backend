const diagramModel = require("../../models/diagrams/diagrams");

const createNewDiagram = async (req, res) => {
  try {
    const diagram = await diagramModel.create(req.body);
    await diagram.save();
    res.json("done");
  } catch (error) {
    res.status(400).json({ error: "something went wrong" });
  }
};

const getUserDiagrams = async (req, res) => {
  try {
    const diagrams = await diagramModel.find({ userId: req.params.uid });
    const pageNo = req.params.page;
    const specificDagrams = {
      diagrams: diagrams.slice((pageNo - 1) * 8, pageNo * 8),
      diagramsNum: diagrams.length,
    };
    res.status(200).json(specificDagrams);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong, try again later" });
  }
};

const getSingleDiagram = async (req, res) => {
  try {
    const diagram = await diagramModel.findById(req.params.diagramId);
    res.status(200).json(diagram);
  } catch (error) {
    res.status(400).json("Enternal Server Error");
  }
};

const updateDiagram = async (req, res) => {
  try {
    const newDiagram = req.body;
    await diagramModel.updateOne(
      { _id: req.params.diagramId },
      {
        $set: {
          diagram: newDiagram.diagram,
          svg: newDiagram.svg,
        },
      }
    );
    res.status(200).json("Diagram Updated Successfully");
  } catch (error) {
    res.status(400).json("Internal Server Error");
  }
};

const deleteDiagram = async (req, res) => {
  try {
    await diagramModel.deleteOne({ _id: req.params.diagramId });
    res.status(200).json("Diagram Was Deleted Successfully");
  } catch (error) {
    res.status(400).json({ error: "internal server error" });
  }
};

module.exports = {
  createNewDiagram,
  getUserDiagrams,
  getSingleDiagram,
  deleteDiagram,
  updateDiagram,
};
