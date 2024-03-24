const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Get thought by ID
  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Create a new thought
  createThought: async (req, res) => {
    try {
      const { thoughtText, username } = req.body;
      const thought = await Thought.create({ thoughtText, username });
      // Add the thought ID to the user's thoughts array
      await User.findOneAndUpdate(
        { username },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.status(201).json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Update thought by ID
  updateThought: async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedThought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Delete thought by ID
  deleteThought: async (req, res) => {
    try {
      const deletedThought = await Thought.findByIdAndDelete(req.params.id);
      if (!deletedThought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      // Remove the thought ID from the user's thoughts array
      await User.findOneAndUpdate(
        { username: deletedThought.username },
        { $pull: { thoughts: deletedThought._id } }
      );
      res.json(deletedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Add reaction to thought
  addReaction: async (req, res) => {
    try {
      const { reactionBody, username } = req.body;
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: { reactionBody, username } } },
        { new: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  // Delete reaction from thought
  deleteReaction: async (req, res) => {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );
      if (!updatedThought) {
        res.status(404).json({ message: 'Thought not found' });
        return;
      }
      res.json(updatedThought);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
};

module.exports = thoughtController;

