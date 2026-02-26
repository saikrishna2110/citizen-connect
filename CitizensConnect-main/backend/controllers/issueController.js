const { validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const User = require('../models/User');

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private (Citizens only)
const createIssue = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, category, priority, location, tags } = req.body;

    // Create issue
    const issue = await Issue.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      location,
      tags: tags || [],
      createdBy: req.user._id
    });

    // Populate user data
    await issue.populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: {
        issue
      }
    });

  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private (Developers & Politicians)
const getAllIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};

    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Add priority filter
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Add status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (req.query.sort === 'priority') {
      sortOption = { priority: -1, createdAt: -1 };
    } else if (req.query.sort === 'votes') {
      sortOption = { voteCount: -1, createdAt: -1 };
    }

    const issues = await Issue.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email role')
      .populate('votes.user', 'name email role')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Issue.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        issues,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving issues',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user's own issues
// @route   GET /api/issues/my
// @access  Private (Any authenticated user)
const getMyIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const issues = await Issue.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Issue.countDocuments({ createdBy: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        issues,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get my issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving your issues',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Private
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email role')
      .populate('votes.user', 'name email role');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        issue
      }
    });

  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private (Issue creator or Developers/Politicians)
const updateIssue = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const isOwner = issue.createdBy.toString() === req.user._id.toString();
    const isAdmin = ['developer', 'politician'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this issue'
      });
    }

    const { title, description, category, priority, status, location, tags, assignedTo } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined && isAdmin) updateData.status = status; // Only admins can change status
    if (location !== undefined) updateData.location = location;
    if (tags !== undefined) updateData.tags = tags;
    if (assignedTo !== undefined && isAdmin) updateData.assignedTo = assignedTo; // Only admins can assign

    issue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('comments.user', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: {
        issue
      }
    });

  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private (Issue creator or Developers only)
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const isOwner = issue.createdBy.toString() === req.user._id.toString();
    const isDeveloper = req.user.role === 'developer';

    if (!isOwner && !isDeveloper) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue'
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    issue.comments.push({
      user: req.user._id,
      content: content.trim()
    });

    await issue.save();
    await issue.populate('comments.user', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: issue.comments[issue.comments.length - 1]
      }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/issues/:id/comments/:commentId
// @access  Private (Comment author or Developers)
const deleteComment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const comment = issue.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check permissions
    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isDeveloper = req.user.role === 'developer';

    if (!isCommentAuthor && !isDeveloper) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    issue.comments.pull(req.params.commentId);
    await issue.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Vote on issue
// @route   POST /api/issues/:id/vote
// @access  Private
const voteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const existingVote = issue.votes.find(vote =>
      vote.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      // Remove vote
      issue.votes = issue.votes.filter(vote =>
        vote.user.toString() !== req.user._id.toString()
      );
    } else {
      // Add vote
      issue.votes.push({ user: req.user._id });
    }

    await issue.save();
    await issue.populate('votes.user', 'name email role');

    res.status(200).json({
      success: true,
      message: existingVote ? 'Vote removed' : 'Vote added',
      data: {
        votes: issue.votes,
        voteCount: issue.votes.length
      }
    });

  } catch (error) {
    console.error('Vote issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing vote',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get issue statistics
// @route   GET /api/issues/stats
// @access  Private (Developers & Politicians)
const getIssueStats = async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: null,
          totalIssues: { $sum: 1 },
          openIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          inProgressIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          resolvedIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          closedIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          urgentPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          },
          easyPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'easy'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalIssues: 0,
      openIssues: 0,
      inProgressIssues: 0,
      resolvedIssues: 0,
      closedIssues: 0,
      urgentPriority: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
      easyPriority: 0
    };

    res.status(200).json({
      success: true,
      data: {
        stats: result
      }
    });

  } catch (error) {
    console.error('Get issue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
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
};
