import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useDropzone } from 'react-dropzone';
import {
  MessageSquare, ThumbsUp, Camera, MapPin, AlertTriangle,
  CheckCircle, Clock, User, Tag, Send, X, ChevronDown, RefreshCw, ChevronUp
} from 'lucide-react';
import './Tickets.css';

const PRIORITY_LEVELS = {
  low: { label: 'Low', color: '#10b981', icon: Clock },
  easy: { label: 'Easy', color: '#22c55e', icon: Clock },
  medium: { label: 'Medium', color: '#f59e0b', icon: AlertTriangle },
  high: { label: 'High', color: '#ef4444', icon: AlertTriangle },
  urgent: { label: 'Urgent', color: '#dc2626', icon: AlertTriangle }
};

const TICKET_CATEGORIES = [
  'Infrastructure', 'Healthcare', 'Education', 'Environment',
  'Transportation', 'Public Safety', 'Utilities', 'Other'
];

const Tickets = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    tickets, onlineIssues, refreshOnlineIssues, lastOnlineUpdate,
    createTicket, voteTicket, markTicketDone, assignPolitician,
    messages, sendMessage, loadMessages, joinTicketRoom, leaveTicketRoom,
    likeComment, deleteTicket, deleteComment
  } = useSocket();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all'); // all, open, solved, my_tickets, online_issues
  const [sortBy, setSortBy] = useState('newest'); // newest, priority, votes
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [likedMessages, setLikedMessages] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [commentPosted, setCommentPosted] = useState(false);

  // Form states
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    images: [],
    taggedPoliticians: []
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Image upload with dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }));
      setTicketForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    },
    maxFiles: 5
  });

  const removeImage = (imageId) => {
    setTicketForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.title.trim() || !ticketForm.description.trim()) return;

    const ticketData = {
      id: Date.now().toString(),
      ...ticketForm,
      status: 'open',
      upvotes: 0,
      voters: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    // Create the ticket
    createTicket(ticketData);

    // Reset form
    setTicketForm({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      location: '',
      images: [],
      taggedPoliticians: []
    });
    setShowCreateForm(false);

    // Scroll to top to show the newly created ticket
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleVote = (ticketId) => {
    // Allow voting on both citizen-reported issues and online issues
    const issue = allIssues.find(i => i.id === ticketId);
    if (issue) {
      voteTicket(ticketId);
    }
  };

  const handleMarkDone = (ticketId) => {
    markTicketDone(ticketId);
  };

  const handleSendMessage = (ticketId) => {
    if (messageInput.trim()) {
      sendMessage(ticketId, messageInput);
      setMessageInput('');
      setCommentPosted(true);
      setTimeout(() => setCommentPosted(false), 3000); // Hide after 3 seconds
      // Scroll to bottom after sending message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLikeComment = (ticketId, messageId) => {
    likeComment(ticketId, messageId);
  };

  const handleLikeMessage = (messageId) => {
    if (selectedTicket && messageId) {
      likeComment(selectedTicket.id, messageId);
    }
  };

  const handleRefreshOnlineIssues = async () => {
    setIsRefreshing(true);
    try {
      await refreshOnlineIssues();
    } catch (error) {
      console.error('Failed to refresh online issues:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    loadMessages(ticket.id);
    joinTicketRoom(ticket.id);
  };

  const closeTicketDetails = () => {
    if (selectedTicket) {
      leaveTicketRoom(selectedTicket.id);
    }
    setSelectedTicket(null);
  };

  // Combine tickets and online issues, preferring user tickets over online issues
  const combinedIssues = [
    ...tickets.map(ticket => ({ ...ticket, isOnlineIssue: false })),
    ...onlineIssues.map(issue => ({ ...issue, isOnlineIssue: true }))
  ];

  // Remove duplicates - if same title exists, keep the user-created ticket
  const titleMap = new Map();
  const allIssues = [];

  combinedIssues.forEach(issue => {
    const existing = titleMap.get(issue.title);
    if (!existing) {
      titleMap.set(issue.title, issue);
      allIssues.push(issue);
    } else if (!existing.isOnlineIssue && issue.isOnlineIssue) {
      // Keep existing user ticket, ignore online duplicate
      return;
    } else if (existing.isOnlineIssue && !issue.isOnlineIssue) {
      // Replace online issue with user ticket
      const index = allIssues.indexOf(existing);
      allIssues[index] = issue;
      titleMap.set(issue.title, issue);
    }
    // If both are online or both are user tickets, keep the first one
  });

  // Filter and sort issues
  const filteredAndSortedTickets = allIssues
    .filter(issue => {
      if (!issue) return false;

      const matchesFilter =
        filter === 'all' ||
        (filter === 'open' && issue.status === 'open') ||
        (filter === 'solved' && issue.status === 'solved') ||
        (filter === 'my_tickets' && issue.authorId === user?.uid) ||
        (filter === 'online_issues' && issue.isOnlineIssue);

      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, easy: 1.5, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'votes':
          return b.upvotes - a.upvotes;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (!user) {
    return (
      <div className="tickets-container">
        <div className="login-prompt">
          <h2>Please login to view and create issues</h2>
          <p>Once logged in, you'll be able to report civic issues and track their progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <div className="header-content">
          <h1>Citizen Issues & Concerns</h1>
          <p>Raise civic issues, track progress, and communicate directly with politicians</p>
        </div>
        <div className="header-actions">
          <button
            className="refresh-btn"
            onClick={handleRefreshOnlineIssues}
            disabled={isRefreshing}
            title="Refresh online issues"
          >
            <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Online Issues'}
          </button>
          <button
            className="create-ticket-btn"
            onClick={() => setShowCreateForm(true)}
          >
            <MessageSquare size={18} />
            Create New Issue
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="tickets-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Issues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Issues</option>
            <option value="open">Open</option>
            <option value="solved">Solved</option>
            <option value="my_tickets">My Issues</option>
            <option value="online_issues">Online Issues</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="priority">Priority</option>
            <option value="votes">Most Voted</option>
          </select>
        </div>
      </div>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content ticket-form-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Ticket</h2>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="ticket-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief title for your issue"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    {TICKET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your issue in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    {Object.entries(PRIORITY_LEVELS).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={ticketForm.location}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Area/Location (optional)"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label>Images (Optional)</label>
                <div className="image-upload">
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    <Camera size={24} />
                    <p>{isDragActive ? 'Drop images here' : 'Drag & drop images or click to select'}</p>
                    <span className="upload-hint">Max 5 images, 10MB each</span>
                  </div>

                  {ticketForm.images.length > 0 && (
                    <div className="image-previews">
                      {ticketForm.images.map((image) => (
                        <div key={image.id} className="image-preview">
                          <img src={image.preview} alt="Preview" />
                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => removeImage(image.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="tickets-list">
        {filteredAndSortedTickets.length === 0 ? (
          <div className="no-tickets">
            <MessageSquare size={48} />
            <h3>{searchTerm ? 'No issues found' : 'No issues reported yet'}</h3>
            <p>
              {searchTerm
                ? 'Try adjusting your search terms or filters'
                : 'Be the first to report a civic issue and help improve your community!'
              }
            </p>
            {!searchTerm && (
              <button
                className="create-ticket-btn"
                onClick={() => setShowCreateForm(true)}
                style={{marginTop: '20px'}}
              >
                <MessageSquare size={18} />
                Report Your First Issue
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedTickets.map(ticket => {
            const PriorityIcon = PRIORITY_LEVELS[ticket.priority]?.icon || Clock;
            const priorityColor = PRIORITY_LEVELS[ticket.priority]?.color || '#6b7280';



            return (
              <div key={ticket.id} className={`ticket-card ${ticket.status} ${ticket.isOnlineIssue ? 'online-issue' : ''}`}>
                <div className="ticket-header">
                  <div className="ticket-meta">
                    <span className="priority-badge" style={{ backgroundColor: priorityColor }}>
                      <PriorityIcon size={14} />
                      {PRIORITY_LEVELS[ticket.priority]?.label}
                    </span>
                    <span className="category-badge">{ticket.category || 'General'}</span>
                    <span className={`status-badge ${ticket.status}`}>
                      {ticket.status === 'solved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {ticket.status}
                    </span>
                    {ticket.isOnlineIssue && (
                      <span className="source-badge online-source">
                        <MessageSquare size={14} />
                        Online
                      </span>
                    )}
                  </div>

                  <div className="ticket-actions">
                    {user?.role === 'Politician' && ticket.status === 'open' && (
                      <button
                        className="mark-done-btn"
                        onClick={() => handleMarkDone(ticket.id)}
                      >
                        <CheckCircle size={16} />
                        Mark Done
                      </button>
                    )}

                    {user?.role === 'Developer' && (
                      <button
                        className="delete-ticket-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this issue?')) {
                            deleteTicket(ticket.id);
                          }
                        }}
                        title="Delete Issue (Developer Only)"
                      >
                        <X size={16} />
                        Delete Issue
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description">{ticket.description}</p>

                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-percentage">{ticket.progress || 0}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${ticket.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                {ticket.images && ticket.images.length > 0 && (
                  <div className="ticket-images">
                    {ticket.images.slice(0, 3).map((image, idx) => (
                      <img key={idx} src={image.url || image.preview} alt={`Ticket image ${idx + 1}`} />
                    ))}
                    {ticket.images.length > 3 && (
                      <div className="more-images">+{ticket.images.length - 3}</div>
                    )}
                  </div>
                )}

                {/* Like Status Display */}
                {ticket.voters?.includes(user?.uid) && (
                  <div className="like-status">
                    <ChevronUp size={14} className="liked-icon" />
                    <span>You liked this issue</span>
                  </div>
                )}

                {/* Recent Comments Display */}
                {ticket.comments && ticket.comments.length > 0 && (
                  <div className="recent-comments">
                    <div className="comment-preview">
                      <MessageSquare size={14} />
                      <span className="comment-count">{ticket.comments.length} comment{ticket.comments.length !== 1 ? 's' : ''}</span>
                    </div>
                    {ticket.comments.slice(0, 2).map((comment, idx) => (
                      <div key={idx} className="comment-snippet">
                        <div className="comment-author">
                          <User size={12} />
                          <span>{comment.author}</span>
                        </div>
                        <div className="comment-text">
                          {comment.content.length > 80
                            ? `${comment.content.substring(0, 80)}...`
                            : comment.content
                          }
                        </div>
                        <div className="comment-time">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {ticket.comments.length > 2 && (
                      <div className="more-comments">
                        +{ticket.comments.length - 2} more comment{ticket.comments.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}

                <div className="ticket-footer">
                  <div className="ticket-author">
                    <User size={16} />
                    <span>{ticket.author}</span>
                    <span className="ticket-date">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="ticket-actions">
                    <button
                      className={`vote-btn ${ticket.voters?.includes(user?.uid) ? 'voted liked' : ''}`}
                      onClick={() => handleVote(ticket.id)}
                      title={ticket.voters?.includes(user?.uid) ? 'Unlike this issue' : 'Like this issue'}
                    >
                      <ChevronUp size={16} className={ticket.voters?.includes(user?.uid) ? 'filled' : ''} />
                      <span>{ticket.upvotes || 0}</span>
                      {ticket.voters?.includes(user?.uid) && <span className="like-text">Liked</span>}
                    </button>

                    <button
                      className={`comment-btn ${ticket.comments?.some(comment => comment.authorId === user?.uid) ? 'commented' : ''}`}
                      onClick={() => openTicketDetails(ticket)}
                      title={ticket.comments?.some(comment => comment.authorId === user?.uid) ? 'You commented on this issue - view discussion' : 'View all comments and add your comment'}
                    >
                      <MessageSquare size={16} className={ticket.comments?.some(comment => comment.authorId === user?.uid) ? 'filled' : ''} />
                      <span>{ticket.comments?.length || 0}</span>
                      <span className="comment-text">
                        {ticket.comments?.some(comment => comment.authorId === user?.uid) ? 'Commented' : 'Comment'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={closeTicketDetails}>
          <div className="modal-content ticket-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="ticket-details-header">
                <h2>{selectedTicket.title}</h2>
                <div className="ticket-meta-badges">
                  <span className="priority-badge" style={{ backgroundColor: PRIORITY_LEVELS[selectedTicket.priority]?.color }}>
                    {PRIORITY_LEVELS[selectedTicket.priority]?.label}
                  </span>
                  <span className="category-badge">{selectedTicket.category}</span>
                  <span className={`status-badge ${selectedTicket.status}`}>
                    {selectedTicket.status === 'solved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {selectedTicket.status}
                  </span>
                </div>
              </div>
              <button className="close-btn" onClick={closeTicketDetails}>
                <X size={20} />
              </button>
            </div>

            <div className="ticket-details-content">
              <div className="ticket-description-full">
                <p>{selectedTicket.description}</p>
              </div>

              {selectedTicket.images && selectedTicket.images.length > 0 && (
                <div className="ticket-images-full">
                  {selectedTicket.images.map((image, idx) => (
                    <img key={idx} src={image.url || image.preview} alt={`Ticket image ${idx + 1}`} />
                  ))}
                </div>
              )}

              {/* Messages/Comments Section */}
              <div className="messages-section">
                <h3>Discussion</h3>

                <div className="messages-list">
                  {messages
                    .filter(msg => msg.ticketId === selectedTicket.id)
                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                    .map((message, idx) => {
                      // Ensure message has an ID
                      const messageId = message.id || message._id || `msg_${message.timestamp}_${idx}`;

                      return (
                        <div
                          key={messageId}
                          className={`message ${message.authorRole === 'Politician' ? 'politician-message' : ''} ${message.authorId === user?.uid ? 'my-message' : ''}`}
                        >
                          <div className="message-header">
                            <strong className="message-author">{message.author}</strong>
                            <span className="message-role">{message.authorRole}</span>
                            <span className="message-time">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="message-content">{message.content}</div>
                          <div className="message-actions">
                            <button
                              className={`message-like-btn ${message.likes?.includes(user?.uid) ? 'liked' : ''}`}
                              onClick={() => handleLikeMessage(messageId)}
                              title={message.likes?.includes(user?.uid) ? 'Unlike this comment' : 'Like this comment'}
                            >
                              <ChevronUp size={14} className={message.likes?.includes(user?.uid) ? 'filled' : ''} />
                              <span className="like-text">
                                {message.likes?.includes(user?.uid) ? 'Liked' : 'Like'}
                              </span>
                              {(message.likeCount || 0) > 0 && (
                                <span className="like-count">({message.likeCount})</span>
                              )}
                            </button>

                            {user?.role === 'Developer' && (
                              <button
                                className="message-delete-btn"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this comment?')) {
                                    deleteComment(selectedTicket.id, messageId);
                                  }
                                }}
                                title="Delete Comment (Developer Only)"
                              >
                                <X size={14} />
                                <span className="delete-text">Delete</span>
                              </button>
                            )}

                            {message.likes?.includes(user?.uid) && (
                              <span className="user-liked-indicator">You liked this</span>
                            )}
                            {message.authorId === user?.uid && (
                              <span className="own-comment-indicator">Your comment</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="message-input-section">
                  <div className="message-input-header">
                    <MessageSquare size={16} />
                    <span>Add your comment</span>
                    {commentPosted && (
                      <span className="comment-success">
                        ✓ Comment posted successfully!
                      </span>
                    )}
                  </div>
                  <div className="message-input">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or updates..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedTicket.id)}
                    />
                    <button
                      onClick={() => handleSendMessage(selectedTicket.id)}
                      disabled={!messageInput.trim()}
                      className={!messageInput.trim() ? 'disabled' : ''}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <div className="comment-tips">
                    <span>💡 Tip: Your comment will be visible to everyone following this issue. You can like comments to show appreciation!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
