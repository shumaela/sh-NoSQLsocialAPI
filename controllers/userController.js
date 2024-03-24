// controllers/userController.js
const { User } = require('../models');

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.create({ username, email });
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Update user by ID
  updateUser: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Delete user by ID
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      // Remove user from other users' friend lists
      await User.updateMany({}, { $pull: { friends: deletedUser._id } });
      // Remove user's thoughts
      await Thought.deleteMany({ username: deletedUser.username });
      res.json(deletedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Add friend to user's friend list
  addFriend: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

// Remove friend from user's friend list
removeFriend: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
  
    
