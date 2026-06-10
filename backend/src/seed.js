const mongoose = require('mongoose');
const Task = require('./models/Task');
const User = require('./models/User');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create seed user
  let user = await User.findOne({ email: 'seed@test.com' });
  if (!user) {
    user = await User.create({
      name: 'Seed User',
      email: 'seed@test.com',
      password: 'password123'
    });
  }

  // Clear existing tasks for seed user
  await Task.deleteMany({ user: user._id });

  // Create sample tasks
  await Task.insertMany([
    { title: 'Setup project repository', description: 'Initialize git and folder structure', status: 'done', user: user._id },
    { title: 'Build REST API', description: 'Create task CRUD endpoints with Express', status: 'done', user: user._id },
    { title: 'Add JWT Authentication', description: 'Protect routes with JWT middleware', status: 'in-progress', user: user._id },
    { title: 'Build React Frontend', description: 'Create dashboard with task management UI', status: 'in-progress', user: user._id },
    { title: 'Deploy to AWS', description: 'Deploy backend to EC2 with PM2', status: 'todo', user: user._id },
  ]);

  console.log('✅ Database seeded with 5 sample tasks');
  console.log('📧 Login with: seed@test.com / password123');
  mongoose.disconnect();
};

seed().catch(console.error);