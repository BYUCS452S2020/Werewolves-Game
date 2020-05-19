var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  console.log("in lobby");
  res.send('respond with a resource');
});

let rooms = ['room1', 'room2', 'room3'];

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('SEND_ROOM', function(data){
    rooms.push(data);
    io.emit('RECEIVE_ROOM', rooms);
  })
});
  

http.listen(4002, () => {
  console.log('listening on *:4002');
});
