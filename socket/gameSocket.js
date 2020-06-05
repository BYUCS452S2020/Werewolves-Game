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
                socket.emit('is host', false);
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

        socket.on('wolf message', (message) => {
            console.log("wolf messaging");
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            gameroom.addWolfMsg(username, message);
            let wolves = gameroom.getWolves();

            for (let i = 0; i < wolves.length; i++) {
                let s_id = usermap.get(wolves[i].getUsername());
                if (s_id == socket.id)
                    socket.emit('message que', gameroom.getWolfQue());
                else
                    socket.broadcast.to(s_id).emit('message que', gameroom.getWolfQue());
            }
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
            // update game string
            socket.emit('game proceeds', 'into the night');
            socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'into the night');

            // inform players
            gameroom.addMessage('JUDGE', 'WAITING FOR THE HOST TO START!!')
            socket.emit('message que', gameroom.getMessageQue());
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
        });

        socket.on('into the night', () => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            if (gameroom.night) {
                return;
            }
            gameroom.night = true;
            // update message
            gameroom.addMessage('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            gameroom.addWolfMsg('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            gameroom.addSeerMsg('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            gameroom.addWitchMsg('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            socket.emit('message que', gameroom.getMessageQue());
            // update wolves
            let wolves = gameroom.getWolves();
            for (let i = 0; i < wolves.length; i++) {
                let s_id = usermap.get(wolves[i].getUsername());
                if (i == wolves.length - 1) {
                    if (s_id == socket.id)
                        socket.emit('wolves kill');
                    else
                        socket.broadcast.to(s_id).emit('wolves kill');
                }
                if (s_id == socket.id)
                    socket.emit('message que', gameroom.getWolfQue());
                else
                    socket.broadcast.to(s_id).emit('message que', gameroom.getWolfQue());
            }
            // update seer
            let seer = gameroom.getSeer();
            if (seer) {
                gameroom.addAbilitiesOnProcess();
                let s_id = usermap.get(seer.getUsername());
                if (s_id == socket.id) {
                    socket.emit('message que', gameroom.getSeerQue());
                    socket.emit('seer test');
                }
                else {
                    socket.broadcast.to(s_id).emit('message que', gameroom.getSeerQue());
                    socket.broadcast.to(s_id).emit('seer test');
                }
            }
            // update witch
            let witch = gameroom.getWitch();
            if (witch) {
                gameroom.witchFunctioned = false;
                if (gameroom.getPotion()) {
                    gameroom.addAbilitiesOnProcess();
                }
                if (gameroom.getPoison()) {
                    gameroom.addAbilitiesOnProcess();
                    let s_id = usermap.get(witch.getUsername());
                    if (s_id == socket.id) {
                        socket.emit('message que', gameroom.getWitchQue());
                        socket.emit('witch kill');
                    }
                    else {
                        socket.broadcast.to(s_id).emit('message que', gameroom.getWitchQue());
                        socket.broadcast.to(s_id).emit('witch kill');
                    }
                }
            }
            // wolves kill emit
            let alpha_wolves = wolves.filter(wolves => (wolves.ability && wolves.alive));
            if (alpha_wolves.length != 0) {
                gameroom.addAbilitiesOnProcess();
                let alpha_wolf = alpha_wolves[0];
                let s_id = usermap.get(alpha_wolf.getUsername());
                socket.broadcast.to(s_id).emit('wolves kill');
            }
        });

        socket.on('wolves kill', id => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            if (id != 0) {
                // killing player
                console.log(`Killing player ${id}`);
                gameroom.addWolfMsg('JUDGE', `Killing player ${id}`);
                gameroom.addPlayersGotKilled(id);
                // if still have potion tell witch who died
                let witch = gameroom.getWitch();
                if (witch) {
                    let s_id = usermap.get(witch.getUsername());
                    if (gameroom.getPotion()) {
                        socket.broadcast.to(s_id).emit('witch save', id);
                    }
                }

                // update wolves chat frontend
                let wolves = gameroom.getWolves();
                for (let i = 0; i < wolves.length; i++) {
                    let s_id = usermap.get(wolves[i].getUsername());
                    if (s_id == socket.id)
                        socket.emit('message que', gameroom.getWolfQue());
                    else
                        socket.broadcast.to(s_id).emit('message que', gameroom.getWolfQue());
                }
            }
            gameroom.deleteAbilitiesOnProcess();
            if (gameroom.checkAbilitiesStatus()) {
                let s_id = usermap.get(gameroom.getHost());
                if (s_id == socket.id)
                    socket.emit('game proceeds', 'Starting the day');
                else
                    socket.broadcast.to(s_id).emit('game proceeds', 'Starting the day');
            }
        });

        socket.on('witch save', id => {
            console.log(`Player ${id} has been attacked. Saving him?`);
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (id != 0 && !gameroom.witchFunctioned) {
                // saving player
                gameroom.witchFunctioned = !gameroom.witchFunctioned;
                gameroom.usedPotion();
                gameroom.addWitchMsg('JUDGE', `You have saved player ${id}`);
                gameroom.deletePlayerGotKilled(id);
                socket.emit('message que', gameroom.getWitchQue());
            }
            if (id != 0 && gameroom.witchFunctioned) {
                gameroom.addWitchMsg('JUDGE', `Only one potion per night please`);
                socket.emit('message que', gameroom.getWitchQue());
            }
            gameroom.deleteAbilitiesOnProcess();
            if (gameroom.checkAbilitiesStatus()) {
                let s_id = usermap.get(gameroom.getHost());
                if (s_id == socket.id)
                    socket.emit('game proceeds', 'Starting the day');
                else
                    socket.broadcast.to(s_id).emit('game proceeds', 'Starting the day');
            }
        });

        socket.on('witch kill', id => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (id != 0 && !gameroom.witchFunctioned) {
                // killing player
                gameroom.addWitchMsg('JUDGE', `Poisoning player ${id}`);
                gameroom.addPlayersGotKilled(id);
                socket.emit('message que', gameroom.getWitchQue());
                // turn witches' ability
                gameroom.usedPoison();
                gameroom.witchFunctioned = !gameroom.witchFunctioned;
                socket.emit('player info', gameroom.getWitch());
            }
            if (id != 0 && gameroom.witchFunctioned) {
                gameroom.addWitchMsg('JUDGE', `Only one potion per night please`);
                socket.emit('message que', gameroom.getWitchQue());
            }
            gameroom.deleteAbilitiesOnProcess();
            if (gameroom.checkAbilitiesStatus()) {
                let s_id = usermap.get(gameroom.getHost());
                if (s_id == socket.id)
                    socket.emit('game proceeds', 'Starting the day');
                else
                    socket.broadcast.to(s_id).emit('game proceeds', 'Starting the day');
            }
        });

        socket.on('seer test', id => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (id != 0) {
                // killing player
                gameroom.addSeerMsg('JUDGE', `Testing player ${id}`);
                let result = gameroom.getSide(id);
                if (result != -1)
                    gameroom.addSeerMsg('JUDGE', `Player ${id} is good`);
                else
                    gameroom.addSeerMsg('JUDGE', `Player ${id} is bad`);

                socket.emit('message que', gameroom.getSeerQue());
            }
            gameroom.deleteAbilitiesOnProcess();
            if (gameroom.checkAbilitiesStatus()) {
                let s_id = usermap.get(gameroom.getHost());
                if (s_id == socket.id)
                    socket.emit('game proceeds', 'Starting the day');
                else
                    socket.broadcast.to(s_id).emit('game proceeds', 'Starting the day');
            }
        });

        socket.on('starting the day', () => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            // update players got killed list
            gameroom.night = false;
            console.log("PlayersGotKilled: ", gameroom.getPlayersGotKilled())
            let playersGotKilled = gameroom.getPlayersGotKilled();
            for (let i = 0; i < playersGotKilled.length; i++) {
                gameroom.addMessage('JUDGE', `Player ${playersGotKilled[i]} got killed`);
                gameroom.killPlayer(playersGotKilled[i]);
                gameroom.deletePlayerGotKilled(playersGotKilled[i]);
            }
            // choose random player to start
            var alivePlayers = gameroom.getAllPlayerNames();
            let random = Math.round(Math.random() * (alivePlayers.length - 1));
            var startPlayer = alivePlayers[random];
            // update frontend
            gameroom.addMessage('JUDGE', `Starting with player ${startPlayer.id}`);
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            socket.emit('message que', gameroom.getMessageQue());
            socket.emit('game proceeds', 'start voting');
            socket.emit('get players', gameroom.getAllPlayerNames());
            socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
        });

        socket.on('start voting', () => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            if (gameroom.voting) {
                return;
            }

            gameroom.voting = true;

            socket.emit('voting');
            socket.to(gameroom.getRoomName()).broadcast.emit('voting');
        });

        socket.on('voting', (id) => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            // set vote
            let c_id = gameroom.getPlayerID(username);
            gameroom.vote(c_id,id);
            gameroom.addMessage("JUDGE", `Player ${c_id} voted for player ${id}`);
            // if everyone has voted, inform host and update the front
            if (gameroom.checkIfVoted()) {
                socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
                socket.emit('message que', gameroom.getMessageQue());
                // check for most voted
                let voteResult = gameroom.getMostVoted();

                let s_id = usermap.get(gameroom.getHost());
                if (s_id == socket.id)
                    socket.emit('game proceeds', 'into the night');
                else
                    socket.broadcast.to(s_id).emit('game proceeds', 'into the night');
            }
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