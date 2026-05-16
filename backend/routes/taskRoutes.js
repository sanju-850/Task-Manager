const express = require("express");
const Task = require("../models/Task");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create task - Admin only
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;
    const tasker = await User.findOne({
      _id: assignedTo,
      role: { $in: ["Member"] },
    });

    if (!tasker) {
      return res.status(400).json({ message: "Task must be assigned to a Member" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get tasks. Admin sees all tasks; Tasker sees only assigned tasks.
router.get("/", protect, async (req, res) => {
  try {
    const query = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };

    const tasks = await Task.find(query)
      .populate("project", "name")
      .populate("assignedTo", "name email role");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update task status. Taskers can only update their assigned tasks.
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Pending", "In Progress", "Completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid task status" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You can only update your assigned tasks" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("project", "name")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
// Dashboard task stats
router.get("/dashboard/stats", protect, async (req, res) => {
  try {
    const query = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };

    const totalTasks = await Task.countDocuments(query);

    const pendingTasks = await Task.countDocuments({
      ...query,
      status: "Pending",
    });

    const completedTasks = await Task.countDocuments({
      ...query,
      status: "Completed",
    });

    const overdueTasks = await Task.countDocuments({
      ...query,
      dueDate: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    res.status(200).json({
      totalTasks,
      pendingTasks,
      completedTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
