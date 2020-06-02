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

    let mockPlayers = [new Player('m1'), new Player('m2'), new Player('m3')
        , new Player('m4'), new Player('m5'), new Player('m6'), new Player('m7'), new Player('m8')];

    io.on('connection', (socket) => {
        // console.log("client connected");
        // socket.emit('RECEIVE_ROOM', rooms);


        socket.on('request rooms', function () {
            // console.log("rooms: ", [...roomManager.keys()]);
            io.emit('RECEIVE_ROOM', [...roomManager.keys()]);
        });

        socket.on('join', (username, room) => {
            console.log(`${username} joining room '${room}'`);
            // socket.join(username);
            socket.join(room);
            socket.join(socket.id);
            player = new Player(username);
            gameroom = null;

            socket.emit('player info', player);

            // Create Room
            if (!roomManager.has(room)) {
                gameroom = new GameRoom(room, player);
                roomManager.set(room, gameroom);
                rooms = [...roomManager.keys()];
                io.emit('RECEIVE_ROOM', rooms);
                socket.emit('message que', gameroom.getMessageQue());
                socket.emit('get players', gameroom.getAllPlayerNames());
                socket.emit('is host', true);
            }
            // Room Already Created
            else {
                gameroom = roomManager.get(room);
                gameroom.joinPlayer(player);
                socket.emit('message que', gameroom.getMessageQue());
                socket.to(room).broadcast.emit('message que', gameroom.getMessageQue());
                socket.to(room).broadcast.emit('get players', gameroom.getAllPlayerNames());
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
        });

        socket.on('chat message', (message) => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            gameroom.addMessage(username, message);
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            socket.emit('message que', gameroom.getMessageQue());
        });

        socket.on('start game', () => {
            // init game
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            gameroom.init_game();
            
            // send players info
            let players = gameroom.getPlayers();
            console.log("sockmap: ", sockmap);
            console.log("sock rooms: ", socket.rooms);
            for (let i = 0; i < players.length; i++) {
                let s_id = usermap.get(players[i].getUsername());
                if (s_id == socket.id)
                    socket.emit('player info', players[i]);
                else
                    socket.broadcast.to(s_id).emit('player info', players[i]);
            }
            
        });

        socket.on('into the night', () => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);


        });


        socket.on('leave', () => {
            console.log("leave");
            username = sockmap.get(socket.id);

            // make sure game room exist
            if (userroom.has(username)) {
                // delete user info from game room
                gameroom = userroom.get(username);
                userroom.delete(username);
                gameroom.deletePlayer(username);
                // check if anyone left
                if (gameroom.isEmpty()) {
                    roomManager.delete(gameroom.getRoomName());
                }
                else {
                    socket.broadcast.to(usermap.get(gameroom.getHost())).emit('is host', true);
                    console.log("room name: ", gameroom.getRoomName());
                    socket.to(gameroom.getRoomName()).broadcast.emit('message que', gameroom.getMessageQue());
                    socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
                }
            }
            // rooms = [ ...roomManager.keys() ];
            io.emit('RECEIVE_ROOM', [...roomManager.keys()]);
        });

        socket.on('disconnect', () => {
            console.log("disconnected");
            username = sockmap.get(socket.id);
            sockmap.delete(socket.id);
            usermap.delete(username);
            // make sure game room exist
            if (userroom.has(username)) {
                // delete user info from game room
                gameroom = userroom.get(username);
                userroom.delete(username);
                gameroom.deletePlayer(username);
                // check if anyone left
                if (gameroom.isEmpty()) {
                    roomManager.delete(gameroom.getRoomName());
                }
                else {
                    socket.broadcast.to(usermap.get(gameroom.getHost())).emit('is host', true);

                    console.log("room name: ", gameroom.getRoomName());
                    socket.to(gameroom.getRoomName()).broadcast.emit('message que', gameroom.getMessageQue());
                    socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
                }
            }

            io.emit('RECEIVE_ROOM', [...roomManager.keys()]);
        });

    });


    http.listen(4002, () => {
        console.log('Lobby listening on *:4002');
    });
}