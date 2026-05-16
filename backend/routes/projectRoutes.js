const express = require("express");
const Project = require("../models/Project");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create project - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.create({
      name,
      description,
      members,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get projects. Admin sees all; Tasker sees projects they belong to.
router.get("/", protect, async (req, res) => {
  try {
    const query = req.user.role === "Admin" ? {} : { members: req.user._id };
    const projects = await Project.find(query)
      .populate("members", "name email role")
      .populate("createdBy", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
