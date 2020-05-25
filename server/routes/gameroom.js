module.exports = app => {
  var http = require('http').createServer(app);
  var io = require('socket.io')(http);

  io.on('connection', (socket) => {
    socket.on("join", async room => {
      socket.join(room);
      io.emit("roomJoined", room);
    });
  
    console.log("client connected");
    socket.emit('RECEIVE_MSG', rooms);

    socket.on('SEND_MSG', function (data) {
      console.log("msg: ", data);
      io.emit('RECEIVE_MSG', rooms);
    })
  });


  http.listen(4003, () => {
    console.log('Games listening on *:4003');
  });
}