const Task = require('../models/Task');
const {
  isValidStatus,
  isValidObjectId,
  parseDueDate,
  handleMongooseError,
} = require('../utils/validation');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (status !== undefined && !isValidStatus(status)) {
      return res.status(400).json({ message: 'Status must be todo, in-progress, or done' });
    }

    const parsedDueDate = parseDueDate(dueDate);
    if (parsedDueDate === null) {
      return res.status(400).json({ message: 'Invalid dueDate format' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || undefined,
      status,
      dueDate: parsedDueDate,
      user: req.userId,
    });

    res.status(201).json(task);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filter = { user: req.userId };

    if (req.query.status) {
      if (!isValidStatus(req.query.status)) {
        return res.status(400).json({ message: 'Status must be todo, in-progress, or done' });
      }
      filter.status = req.query.status;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const updates = {};
    const { title, description, status, dueDate } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description?.trim() || '';
    }

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        return res.status(400).json({ message: 'Status must be todo, in-progress, or done' });
      }
      updates.status = status;
    }

    if (dueDate !== undefined) {
      const parsedDueDate = parseDueDate(dueDate);
      if (parsedDueDate === null) {
        return res.status(400).json({ message: 'Invalid dueDate format' });
      }
      updates.dueDate = parsedDueDate;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    handleMongooseError(err, res);
  }
};
