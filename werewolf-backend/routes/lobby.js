var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  console.log("in lobby");
  res.send('respond with a resource');
});

let interval;

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('SEND_MESSAGE', function(data){
      io.emit('RECEIVE_MESSAGE', data);
  })
});
  

http.listen(4002, () => {
  console.log('listening on *:4002');
});
