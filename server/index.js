const { server } = require('socket.io');
const io = new server({
    cors: {
        origin: 'http://localhost:3000',
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("user-connected", userId);

        socket.on("call-offer", (userId, offer) => {
            socket.broadcast.to(userId).emit("user-offer", userId, offer);
        });

        socket.on("call-answer", (userId, offer) => {
            socket.broadcast.to(userId).emit("user-answer", userId, offer);
            io.sockets.in(roomId).emit("text");
        });
    });
});