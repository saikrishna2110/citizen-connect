import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import OnlineDataService from '../services/OnlineDataService';

// For demo purposes, we'll use a mock server URL
// In production, replace with your actual Socket.IO server
const SOCKET_URL = 'http://localhost:3001';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [onlineIssues, setOnlineIssues] = useState([]);
  const [messages, setMessages] = useState([]);
  const [lastOnlineUpdate, setLastOnlineUpdate] = useState(null);
  const [mockTicketsAdded, setMockTicketsAdded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && !socket) {
      // Initialize socket connection
      const newSocket = io(SOCKET_URL, {
        auth: {
          userId: user.uid,
          role: user.role,
          name: user.name
        },
        transports: ['websocket', 'polling']
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      // Ticket events
      newSocket.on('ticket_created', (ticket) => {
        setTickets(prev => [ticket, ...prev]);
      });

      newSocket.on('ticket_updated', (updatedTicket) => {
        setTickets(prev => prev.map(ticket =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        ));
      });

      newSocket.on('ticket_voted', (data) => {
        setTickets(prev => prev.map(ticket =>
          ticket.id === data.ticketId
            ? { ...ticket, upvotes: data.upvotes, voters: data.voters }
            : ticket
        ));
      });

      // Message events
      newSocket.on('message_received', (message) => {
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => msg.id === message.id);
          if (!exists) {
            return [...prev, message];
          }
          return prev;
        });
      });

      newSocket.on('messages_loaded', (loadedMessages) => {
        // Merge with existing local messages to avoid duplicates
        setMessages(prev => {
          const existingIds = new Set(prev.map(msg => msg.id));
          const newMessages = loadedMessages.filter(msg => !existingIds.has(msg.id));
          return [...prev, ...newMessages];
        });
      });

      newSocket.on('comment_liked', (data) => {
        setMessages(prev => prev.map(msg =>
          msg.id === data.messageId
            ? { ...msg, likes: data.likes, likeCount: data.likeCount }
            : msg
        ));
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user]);

  // Ticket functions
  const createTicket = (ticketData) => {
    const newTicket = {
      ...ticketData,
      author: user.name,
      authorId: user.uid,
      authorRole: user.role,
      progress: 0,
      createdAt: new Date().toISOString()
    };

    // Always add to local state immediately
    setTickets(prev => [newTicket, ...prev]);

    if (socket && isConnected) {
      socket.emit('create_ticket', newTicket);
    }
  };

  const voteTicket = (ticketId) => {
    // Check if it's a ticket or online issue
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    const onlineIssueIndex = onlineIssues.findIndex(issue => issue.id === ticketId);

    if (ticketIndex !== -1) {
      // Update ticket in tickets array
      const ticket = tickets[ticketIndex];
      const isVoted = ticket.voters?.includes(user.uid);

      let newUpvotes, newVoters;
      if (isVoted) {
        // Remove vote
        newVoters = ticket.voters.filter(id => id !== user.uid);
        newUpvotes = Math.max(0, (ticket.upvotes || 0) - 1);
      } else {
        // Add vote
        newVoters = [...(ticket.voters || []), user.uid];
        newUpvotes = (ticket.upvotes || 0) + 1;
      }

      // Update local state immediately
      const updatedTicket = {
        ...ticket,
        upvotes: newUpvotes,
        voters: newVoters
      };

      setTickets(prev => {
        const index = prev.findIndex(ticket => ticket.id === ticketId);
        if (index !== -1) {
          const newTickets = [...prev];
          newTickets[index] = updatedTicket;
          return newTickets;
        }
        return prev;
      });
    } else if (onlineIssueIndex !== -1) {
      // Update online issue in onlineIssues array
      const issue = onlineIssues[onlineIssueIndex];
      const isVoted = issue.voters?.includes(user.uid);

      let newUpvotes, newVoters;
      if (isVoted) {
        // Remove vote
        newVoters = issue.voters.filter(id => id !== user.uid);
        newUpvotes = Math.max(0, (issue.upvotes || 0) - 1);
      } else {
        // Add vote
        newVoters = [...(issue.voters || []), user.uid];
        newUpvotes = (issue.upvotes || 0) + 1;
      }

      // Update local state immediately
      const updatedIssue = {
        ...issue,
        upvotes: newUpvotes,
        voters: newVoters
      };

      setOnlineIssues(prev => {
        const index = prev.findIndex(issue => issue.id === ticketId);
        if (index !== -1) {
          const newIssues = [...prev];
          newIssues[index] = updatedIssue;
          return newIssues;
        }
        return prev;
      });
    }

    // Emit socket event if connected
    if (socket && isConnected) {
      socket.emit('vote_ticket', {
        ticketId,
        userId: user.uid,
        userName: user.name
      });
    }
  };

  const markTicketDone = (ticketId) => {
    // Update local state immediately for better UX
    const updatedTicket = {
      status: 'solved',
      progress: 100
    };

    // Check if it's a regular ticket or online issue
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    const onlineIssueIndex = onlineIssues.findIndex(issue => issue.id === ticketId);

    if (ticketIndex !== -1) {
      // Update regular ticket
      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, ...updatedTicket }
          : ticket
      ));
    } else if (onlineIssueIndex !== -1) {
      // Update online issue
      setOnlineIssues(prev => prev.map(issue =>
        issue.id === ticketId
          ? { ...issue, ...updatedTicket }
          : issue
      ));
    }

    if (socket && isConnected) {
      socket.emit('mark_ticket_done', {
        ticketId,
        markedBy: user.uid,
        markedByName: user.name,
        markedByRole: user.role
      });
    }
  };

  const assignPolitician = (ticketId, politicianId) => {
    if (socket && isConnected) {
      socket.emit('assign_politician', {
        ticketId,
        politicianId,
        assignedBy: user.uid
      });
    }
  };

  // Developer functions
  const deleteTicket = (ticketId) => {
    // Check if it's a regular ticket or online issue
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    const onlineIssueIndex = onlineIssues.findIndex(issue => issue.id === ticketId);

    if (ticketIndex !== -1) {
      // Delete regular ticket
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    } else if (onlineIssueIndex !== -1) {
      // Delete online issue
      setOnlineIssues(prev => prev.filter(issue => issue.id !== ticketId));
    }

    if (socket && isConnected) {
      socket.emit('delete_ticket', {
        ticketId,
        deletedBy: user.uid,
        deletedByName: user.name,
        deletedByRole: user.role
      });
    }
  };

  const deleteComment = (ticketId, messageId) => {
    // Update local state immediately
    setMessages(prev => prev.filter(msg => msg.id !== messageId));

    if (socket && isConnected) {
      socket.emit('delete_comment', {
        ticketId,
        messageId,
        deletedBy: user.uid,
        deletedByName: user.name,
        deletedByRole: user.role
      });
    }
  };

  // Message functions
  const sendMessage = (ticketId, content) => {
    const messageData = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ticketId,
      content,
      author: user.name,
      authorId: user.uid,
      authorRole: user.role,
      timestamp: new Date().toISOString(),
      likes: [],
      likeCount: 0
    };

    // Always add to local state immediately
    setMessages(prev => [...prev, messageData]);

    if (socket && isConnected) {
      socket.emit('send_message', messageData);
    }
  };

  const likeComment = (ticketId, messageId) => {
    // Find the message in local state first - try multiple ID formats
    let messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      // Try alternative ID formats
      messageIndex = messages.findIndex(msg =>
        msg._id === messageId ||
        msg.id?.endsWith(messageId.split('_').pop()) ||
        `msg_${msg.timestamp}_${messages.indexOf(msg)}` === messageId
      );
    }

    if (messageIndex !== -1) {
      const message = messages[messageIndex];
      const isLiked = message.likes?.includes(user.uid);
      const newLikes = isLiked
        ? message.likes.filter(id => id !== user.uid)
        : [...(message.likes || []), user.uid];

      // Update local state immediately
      const updatedMessage = {
        ...message,
        likes: newLikes,
        likeCount: newLikes.length
      };

      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? updatedMessage : msg
      ));

      // Emit socket event if connected
      if (socket && isConnected) {
        socket.emit('like_comment', {
          ticketId,
          messageId: message.id, // Use the actual message ID
          userId: user.uid,
          userName: user.name,
          action: isLiked ? 'unlike' : 'like'
        });
      }
    } else {
      console.warn('Message not found for liking:', messageId);
    }
  };

  const loadMessages = (ticketId) => {
    if (socket && isConnected) {
      socket.emit('load_messages', { ticketId });
    }
  };

  const joinTicketRoom = (ticketId) => {
    if (socket && isConnected) {
      socket.emit('join_ticket_room', { ticketId });
    }
  };

  const leaveTicketRoom = (ticketId) => {
    if (socket && isConnected) {
      socket.emit('leave_ticket_room', { ticketId });
    }
  };

  // Load initial tickets
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('load_tickets');
    } else {
      // For demo purposes, add some mock tickets if socket isn't connected
      const mockTickets = [
        {
          id: 'mock_1',
          title: 'Major potholes blocking MG Road traffic',
          description: 'There are several large potholes on MG Road between Gandhi Statue and Clock Tower that need immediate repair. Vehicles are getting damaged and it\'s causing traffic congestion.',
          category: 'Infrastructure',
          priority: 'high',
          status: 'open',
          author: 'Rajesh Kumar',
          authorId: 'demo_user_1',
          authorRole: 'Citizen',
          upvotes: 24,
          voters: [],
          progress: 65,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          location: 'MG Road, Vijayawada'
        },
        {
          id: 'mock_2',
          title: 'Broken streetlight on Park Street junction',
          description: 'The street light outside house number 45 on Park Street has been non-functional for the past week. This is causing safety concerns during nighttime.',
          category: 'Public Safety',
          priority: 'medium',
          status: 'solved',
          author: 'Priya Sharma',
          authorId: 'demo_user_2',
          authorRole: 'Citizen',
          upvotes: 18,
          voters: [],
          progress: 90,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          location: 'Park Street, Vijayawada'
        },
        {
          id: 'mock_3',
          title: 'Waste collection delayed in residential Sector 7',
          description: 'Municipal garbage collection has been irregular in Sector 7 for the past two weeks. Waste is piling up and causing hygiene issues in the community.',
          category: 'Utilities',
          priority: 'urgent',
          status: 'open',
          author: 'Amit Patel',
          authorId: 'demo_user_3',
          authorRole: 'Citizen',
          upvotes: 35,
          voters: [],
          progress: 25,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          location: 'Sector 7, Vijayawada'
        },
        {
          id: 'mock_4',
          title: 'Water supply disruption in Residential Colony',
          description: 'Water supply has been irregular in the Residential Colony for the past 3 days. Residents are facing severe water shortage and daily activities are affected.',
          category: 'Utilities',
          priority: 'high',
          status: 'open',
          author: 'Sunita Reddy',
          authorId: 'demo_user_4',
          authorRole: 'Citizen',
          upvotes: 42,
          voters: [],
          progress: 80,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          location: 'Residential Colony, Vijayawada'
        },
        {
          id: 'mock_5',
          title: 'Overflowing drain causing flooding in Market Area',
          description: 'The main drain in the Market Area is overflowing during rains, causing water logging and posing health risks to shopkeepers and customers.',
          category: 'Infrastructure',
          priority: 'urgent',
          status: 'solved',
          author: 'Karthik Nair',
          authorId: 'demo_user_5',
          authorRole: 'Citizen',
          upvotes: 29,
          voters: [],
          progress: 65,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          location: 'Market Area, Vijayawada'
        },
        {
          id: 'mock_6',
          title: 'Lack of proper signage at busy intersections',
          description: 'Several busy intersections in the city lack proper traffic signage, leading to confusion and potential accidents. This needs immediate attention.',
          category: 'Public Safety',
          priority: 'medium',
          status: 'open',
          author: 'Meera Joshi',
          authorId: 'demo_user_6',
          authorRole: 'Citizen',
          upvotes: 15,
          voters: [],
          progress: 45,
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          location: 'Multiple Intersections, Vijayawada'
        },
        {
          id: 'mock_7',
          title: 'Park bench needs minor repair',
          description: 'A small crack in the park bench near the entrance needs to be fixed. It\'s a simple repair job.',
          category: 'Other',
          priority: 'easy',
          status: 'open',
          author: 'John Doe',
          authorId: 'demo_user_7',
          authorRole: 'Citizen',
          upvotes: 3,
          voters: [],
          progress: 0,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          location: 'City Park, Vijayawada'
        },
        {
          id: 'mock_8',
          title: 'Street light bulb replacement needed',
          description: 'The street light on Elm Street has a burnt-out bulb that needs replacement. Low priority maintenance task.',
          category: 'Utilities',
          priority: 'low',
          status: 'open',
          author: 'Jane Smith',
          authorId: 'demo_user_8',
          authorRole: 'Citizen',
          upvotes: 2,
          voters: [],
          progress: 0,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          location: 'Elm Street, Vijayawada'
        }
      ];

      // Only add mock data if we don't have any real tickets and haven't added them yet
      if (tickets.length === 0 && !mockTicketsAdded) {
        console.log('Adding mock tickets...');
        setTimeout(() => {
          console.log('Actually adding mock tickets now');
          setTickets(prev => {
            // Double-check to prevent duplicates
            if (prev.length === 0) {
              console.log('Setting mock tickets');
              return mockTickets;
            }
            return prev;
          });
          setMockTicketsAdded(true);
        }, 1000); // Small delay to simulate loading
      }
    }
  }, [socket, isConnected, tickets.length]);

  // Load online issues on component mount
  useEffect(() => {
    const loadOnlineIssues = async () => {
      try {
        const issues = await OnlineDataService.getOnlineIssues();
        setOnlineIssues(issues);
        setLastOnlineUpdate(OnlineDataService.getLastUpdateTime());
      } catch (error) {
        console.error('Error loading online issues:', error);
      }
    };

    loadOnlineIssues();

    // Set up daily refresh interval (check every hour)
    const refreshInterval = setInterval(async () => {
      if (OnlineDataService.needsUpdate()) {
        console.log('Auto-refreshing online issues...');
        const freshIssues = await OnlineDataService.getOnlineIssues();
        // Preserve local votes when refreshing
        setOnlineIssues(currentIssues => {
          return freshIssues.map(freshIssue => {
            const existingIssue = currentIssues.find(issue => issue.id === freshIssue.id);
            if (existingIssue) {
              // Preserve upvotes and voters from local state
              return {
                ...freshIssue,
                upvotes: existingIssue.upvotes || freshIssue.upvotes,
                voters: existingIssue.voters || freshIssue.voters
              };
            }
            return freshIssue;
          });
        });
        setLastOnlineUpdate(OnlineDataService.getLastUpdateTime());
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(refreshInterval);
  }, []);

  // Function to manually refresh online issues
  const refreshOnlineIssues = async () => {
    try {
      const freshIssues = await OnlineDataService.refreshOnlineIssues();
      // Preserve local votes when refreshing
      setOnlineIssues(currentIssues => {
        return freshIssues.map(freshIssue => {
          const existingIssue = currentIssues.find(issue => issue.id === freshIssue.id);
          if (existingIssue) {
            // Preserve upvotes and voters from local state
            return {
              ...freshIssue,
              upvotes: existingIssue.upvotes || freshIssue.upvotes,
              voters: existingIssue.voters || freshIssue.voters
            };
          }
          return freshIssue;
        });
      });
      setLastOnlineUpdate(OnlineDataService.getLastUpdateTime());
      return freshIssues;
    } catch (error) {
      console.error('Error refreshing online issues:', error);
      throw error;
    }
  };

  const value = {
    socket,
    isConnected,
    tickets,
    onlineIssues,
    messages,
    lastOnlineUpdate,
    createTicket,
    voteTicket,
    markTicketDone,
    assignPolitician,
    sendMessage,
    loadMessages,
    joinTicketRoom,
    leaveTicketRoom,
    refreshOnlineIssues,
    likeComment,
    deleteTicket,
    deleteComment
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
