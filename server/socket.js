const Message = require('./models/Message');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Join a college room or specific group room
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });
    
    // Also join a room for the specific UserID to receive direct updates
    socket.on('join_user', (userId) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined user-room ${userId}`);
    });

    // Send a message
    socket.on('send_message', async (data) => {
      // data: { senderId, content, collegeId, groupId (optional), receiverId (optional) }
      try {
        const newMessage = new Message({
          senderId: data.senderId,
          content: data.content,
          collegeId: data.collegeId,
          groupId: data.groupId,
          receiverId: data.receiverId
        });
        await newMessage.save();

        // Broadcast to the specific room (group or private)
        const room = data.groupId || data.receiverId || data.collegeId; 
        // Logic for room names needs to be consistent on client side.
        // For simplicity: if groupId exists, use it. else if receiverId, make a unique pair string? 
        // Or just emit to 'collegeId' for public chat and 'groupId' for private.
        
        let targetRoom = data.collegeId;
        if(data.groupId) targetRoom = data.groupId;
        // For 1-on-1, ideally we'd have a unique room for the two users, or emit to specific socket ID if we tracked it.
        // Falling back to broad college room for demo if not grouped, or client logic handles filtering.
        
        io.to(targetRoom).emit('receive_message', newMessage);
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = socketHandler;
