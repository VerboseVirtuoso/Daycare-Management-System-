const Child = require("../models/Child");

// Controller to add a new child
const addChild = async (req, res) => {
  try {
    const { name, age, gender, parentId, caregiverId, medicalNotes, admissionDate, status } = req.body;

    // Basic validation
    if (!name || typeof age !== "number" || !gender || !parentId || !admissionDate) {
      return res.status(400).json({ message: "Name, age, gender, parentId and admissionDate are required." });
    }

    const newChild = new Child({
      name,
      age,
      gender,
      parentId,
      caregiverId,
      medicalNotes,
      admissionDate,
      status
    });

    await newChild.save();

    // Populate and return the saved child
    const savedChild = await Child.findById(newChild._id).populate("parentId", "name email").populate("caregiverId", "name email");
    res.status(201).json({ child: savedChild });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not add child.", error: error.message });
  }
};

// Controller to get all children
const getAllChildren = async (req, res) => {
  try {
    const children = await Child.find().populate("parentId", "name email").populate("caregiverId", "name email");
    res.status(200).json({ children });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not fetch children.", error: error.message });
  }
};

// Controller to update a child
const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, parentId, caregiverId, medicalNotes, admissionDate, status } = req.body;

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ message: "Child not found." });
    }

    // Update fields if provided
    if (name) child.name = name;
    if (typeof age === "number") child.age = age;
    if (gender) child.gender = gender;
    if (parentId) child.parentId = parentId;
    if (caregiverId !== undefined) child.caregiverId = caregiverId;
    if (medicalNotes !== undefined) child.medicalNotes = medicalNotes;
    if (admissionDate) child.admissionDate = admissionDate;
    if (status) child.status = status;

    await child.save();
    const updatedChild = await Child.findById(id).populate("parentId", "name email").populate("caregiverId", "name email");

    res.status(200).json({ child: updatedChild });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not update child.", error: error.message });
  }
};

// Controller to delete a child
const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    const child = await Child.findById(id);
    if (!child) {
      return res.status(404).json({ message: "Child not found." });
    }

    await Child.findByIdAndDelete(id);
    res.status(200).json({ message: "Child deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Could not delete child.", error: error.message });
  }
};

module.exports = { addChild, getAllChildren, updateChild, deleteChild };
