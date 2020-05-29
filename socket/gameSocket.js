module.exports = app => {
    var http = require('http').createServer(app);
    var io = require('socket.io')(http);
    var GameRoom = require('./gameroom');
    var Player = require('./player');

    // roomManager: room_name, gameroom
    let roomManager = new Map();
    // userroom: username, gameroom
    let userroom = new Map();
    // sockmap: socket.id, username
    let sockmap = new Map();
    // usermap: username, socket.id
    let usermap = new Map();

    let rooms = [];

    // RECEIVE_ROOM
    // SEND_ROOM
    // join
    // chat message
    // get players
    // message que
    // leave

    io.on('connection', (socket) => {
        console.log("client connected");
        // socket.emit('RECEIVE_ROOM', rooms);
        

        // socket.on('SEND_ROOM', function (data) {
        //     console.log("room received: ", data);
        //     io.emit('RECEIVE_ROOM', [ ...roomManager.keys() ]);
        // })

        socket.on('join', (username, room) => {
            console.log(`${username} joining room '${room}'`);
            socket.join(room);
            player = new Player(username);
            gameroom = null;
            message = {
                username: player.username,
                message: `${player.username} joined the room`
            };

            // Create Room
            if (!roomManager.has(room)) {
                gameroom = new GameRoom(room, player);
                roomManager.set(room, gameroom);
                rooms = [ ...roomManager.keys() ];
                socket.broadcast.emit('RECEIVE_ROOM', rooms);
                socket.emit('message que', gameroom.getMessageQue());
                socket.emit('get players', gameroom.getAllPlayerNames());
            }
            // Room Already Created
            else {
                gameroom = roomManager.get(room);
                gameroom.joinPlayer(player);
                socket.emit('message que', gameroom.getMessageQue());
                socket.to(room).broadcast.emit('chat message', message);
                socket.to(room).broadcast.emit('get players', gameroom.getAllPlayerNames());
                socket.emit('chat message', message);
                socket.emit('get players', gameroom.getAllPlayerNames());
            }
            userroom.set(username, gameroom);
            // User connected before update connect info
            if (usermap.has(username)) {
                old_id = usermap.get(username);
                sockmap.delete(old_id);
            }
            usermap.set(username, socket.id);
            sockmap.set(socket.id, username);

        })

        socket.on('chat message', (username, message) => {
            gameroom = userroom.get(username);
            console.log('msg: ', msg);
            console.log('gameroom: ', gameroom);
            gameroom.addMessage(username, message);
            socket.to(gameroom.getRoomName()).broadcast.emit('chat message', msg);
            socket.emit('chat message', msg);
        })


        socket.on('leave', (username) => {
            console.log("leave");

            console.log('roomManager: ', roomManager);
            console.log('rooms: ', [...roomManager.keys()]);

            if (userroom.has(username)) {
                gameroom = userroom.get(username);
                userroom.delete(username);
                gameroom.deletePlayer(username);
                console.log('all players: ', gameroom.players);
                console.log("no play in a room: ",gameroom.isEmpty());
                if (gameroom.isEmpty()) {
                    console.log("deleting ", gameroom.getRoomName());
                    roomManager.delete(gameroom.getRoomName());
                }
                else {
                    msg = {
                        username: username,
                        message: `${username} has left the room`
                    }
                    rooms = [ ...roomManager.keys() ];

                    gameroom.addMessage(msg);
                    console.log("room name: ", gameroom.getRoomName());
                    socket.to(gameroom.getRoomName()).broadcast.emit('chat message', msg);
                    socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
                }
            }
            rooms = [ ...roomManager.keys() ];
            socket.broadcast.emit('RECEIVE_ROOM', rooms);
        });
        socket.on('disconnect', () => {
            console.log("disconnected");
            username = sockmap.get(socket.id);
            sockmap.delete(socket.id);
            usermap.delete(username);

            if (userroom.has(username)) {
                gameroom = userroom.get(username);
                userroom.delete(username);
                gameroom.deletePlayer(username);
                if (gameroom.isEmpty()) {
                    roomManager.delete(gameroom.getRoomName());
                    rooms = [ ...roomManager.keys() ];
                    socket.broadcast.emit('RECEIVE_ROOM', rooms);
                    socket.emit('RECEIVE_ROOM', rooms);
                }
                else {
                    msg = {
                        username: username,
                        message: `${username} has left the room`
                    }
                    rooms = [ ...roomManager.keys() ];

                    gameroom.addMessage(msg);
                    socket.broadcast.emit('RECEIVE_ROOM', rooms);
                    socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
                    socket.to(gameroom.getRoomName()).broadcast.emit('chat message', msg);
                    socket.emit('RECEIVE_ROOM', rooms);
                }
            }
        });

    });


    http.listen(4002, () => {
        console.log('Lobby listening on *:4002');
    });
}