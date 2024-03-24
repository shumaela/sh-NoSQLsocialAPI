const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction
} = require('../controllers/thoughtController');

// GET all thoughts
router.get('/', getAllThoughts);

// GET a single thought by ID
router.get('/:id', getThoughtById);

// POST a new thought
router.post('/', createThought);

// PUT update a thought by ID
router.put('/:id', updateThought);

// DELETE a thought by ID
router.delete('/:id', deleteThought);

// POST add a reaction to a thought
router.post('/:thoughtId/reactions', addReaction);

// DELETE remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', deleteReaction);

module.exports = router;
