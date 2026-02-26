const express = require('express');
const { body } = require('express-validator');
const {
  createIssue,
  getAllIssues,
  getMyIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  addComment,
  deleteComment,
  voteIssue,
  getIssueStats
} = require('../controllers/issueController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createIssueValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn(['Infrastructure', 'Healthcare', 'Education', 'Environment', 'Transportation', 'Public Safety', 'Utilities', 'Other'])
    .withMessage('Please select a valid category'),
  body('priority')
    .optional()
    .isIn(['low', 'easy', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot be more than 100 characters')
];

const updateIssueValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn(['Infrastructure', 'Healthcare', 'Education', 'Environment', 'Transportation', 'Public Safety', 'Utilities', 'Other'])
    .withMessage('Please select a valid category'),
  body('priority')
    .optional()
    .isIn(['low', 'easy', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot be more than 100 characters')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];

// Routes

// Get issue statistics (Developers & Politicians only)
router.get('/stats', protect, authorize('developer', 'politician'), getIssueStats);

// Create issue (Citizens only)
router.post('/', protect, authorize('citizen'), createIssueValidation, createIssue);

// Get all issues (Developers & Politicians only)
router.get('/', protect, authorize('developer', 'politician'), getAllIssues);

// Get user's own issues (Any authenticated user)
router.get('/my', protect, getMyIssues);

// Get single issue (Any authenticated user)
router.get('/:id', protect, getIssue);

// Update issue (Issue creator or Developers/Politicians)
router.put('/:id', protect, updateIssueValidation, updateIssue);

// Delete issue (Issue creator or Developers only)
router.delete('/:id', protect, deleteIssue);

// Vote on issue (Any authenticated user)
router.post('/:id/vote', protect, voteIssue);

// Add comment to issue (Any authenticated user)
router.post('/:id/comments', protect, commentValidation, addComment);

// Delete comment (Comment author or Developers only)
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
