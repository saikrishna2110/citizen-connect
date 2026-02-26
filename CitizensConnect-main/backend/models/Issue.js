const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Infrastructure', 'Healthcare', 'Education', 'Environment', 'Transportation', 'Public Safety', 'Utilities', 'Other'],
      message: 'Please select a valid category'
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'easy', 'medium', 'high', 'urgent'],
      message: 'Priority must be low, easy, medium, high, or urgent'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in-progress', 'resolved', 'closed'],
      message: 'Status must be open, in-progress, resolved, or closed'
    },
    default: 'open'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be more than 100'],
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Issue must belong to a user']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    filename: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isOnlineIssue: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
issueSchema.index({ createdBy: 1 });
issueSchema.index({ status: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ createdAt: -1 });

// Virtual for vote count
issueSchema.virtual('voteCount').get(function() {
  return this.votes.length;
});

// Virtual for comment count
issueSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Pre-save middleware to update progress based on status
issueSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'open':
        if (this.progress === 0) this.progress = 0;
        break;
      case 'in-progress':
        if (this.progress < 25) this.progress = 25;
        break;
      case 'resolved':
      case 'closed':
        this.progress = 100;
        break;
    }
  }
  next();
});

// Static method to get issues by status
issueSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('createdBy', 'name email role');
};

// Static method to get issues by user
issueSchema.statics.getByUser = function(userId) {
  return this.find({ createdBy: userId }).populate('createdBy', 'name email role');
};

// Static method to get issues by priority
issueSchema.statics.getByPriority = function(priority) {
  return this.find({ priority }).populate('createdBy', 'name email role');
};

// Instance method to add comment
issueSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content.trim(),
    createdAt: new Date()
  });
  return this.save();
};

// Instance method to add vote
issueSchema.methods.addVote = function(userId) {
  const existingVote = this.votes.find(vote =>
    vote.user.toString() === userId.toString()
  );

  if (!existingVote) {
    this.votes.push({ user: userId });
  }

  return this.save();
};

// Instance method to remove vote
issueSchema.methods.removeVote = function(userId) {
  this.votes = this.votes.filter(vote =>
    vote.user.toString() !== userId.toString()
  );

  return this.save();
};

module.exports = mongoose.model('Issue', issueSchema);
