import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  maxHttpBufferSize: 1e7 // 10 MB limit for high-res images
});

const MAX_ROOM_SIZE = 2;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (roomId: string) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;

    if (numClients === 0) {
      socket.join(roomId);
      socket.emit('room-joined', { role: 'host' });
    } else if (numClients === 1) {
      socket.join(roomId);
      socket.emit('room-joined', { role: 'guest' });
      // Notify the host that a guest joined
      socket.to(roomId).emit('partner-joined', socket.id);
    } else {
      socket.emit('room-full', roomId);
    }
  });

  socket.on('signal', ({ to, data }) => {
    if (to) {
      socket.to(to).emit('signal', { from: socket.id, data });
    } else {
      // Broadcast to room if no specific target
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit('signal', { from: socket.id, data });
        }
      });
    }
  });

  socket.on('grid-select', ({ roomId, layoutId }) => {
    socket.to(roomId).emit('grid-selected', layoutId);
  });

  socket.on('start-countdown', ({ roomId, slotIndex }) => {
    io.in(roomId).emit('countdown-started', slotIndex);
  });

  socket.on('start-sequence', ({ roomId }) => {
    io.in(roomId).emit('sequence-started');
  });

  socket.on('photo-captured', ({ roomId, slotIndex, photoDataUrl }) => {
    socket.to(roomId).emit('partner-photo', { slotIndex, photoDataUrl });
  });

  socket.on('phase-change', ({ roomId, phase }) => {
    socket.to(roomId).emit('phase-changed', phase);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('partner-left', socket.id);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
