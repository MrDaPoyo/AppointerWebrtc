const socket = io('ws://localhost:3000');
console.log('User connected to room: ', ROOM_ID);
socket.emit('join-room', ROOM_ID, 10);