module.exports = app => {
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);

  let rooms = ['room1', 'room2', 'room3'];

  io.on('connection', (socket) => {
    console.log("client connected");
    socket.emit('RECEIVE_ROOM', rooms);

    socket.on('SEND_ROOM', function (data) {
      console.log("room: ", data);
      rooms.push(data);
      console.log("rooms: ", rooms);
      io.emit('RECEIVE_ROOM', rooms);
    })
  });


  http.listen(4002, () => {
    console.log('Lobby listening on *:4002');
  });
}