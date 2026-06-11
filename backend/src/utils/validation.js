const mongoose = require('mongoose');

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidStatus = (status) => VALID_STATUSES.includes(status);

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parseDueDate = (dueDate) => {
  if (dueDate === undefined || dueDate === null || dueDate === '') return undefined;
  const parsed = new Date(dueDate);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const handleMongooseError = (err, res) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid task ID' });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  return res.status(500).json({ message: err.message });
};

module.exports = {
  VALID_STATUSES,
  EMAIL_REGEX,
  isValidStatus,
  isValidObjectId,
  parseDueDate,
  handleMongooseError,
};
