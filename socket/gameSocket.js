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


    const checkWinning = (gameroom) => {
        let finished = gameroom.checkWinning()
        if (finished != -1) {
            switch (finished) {
                case 1:
                    gameroom.addMessage("JUDGE", `THE GOOD GUYS WON!!!`);
                    break;
                case 0:
                    gameroom.addMessage("JUDGE", `THE WEREWOLVES WON!!!`);
                    break;
                default:
                    console.log('ERROR: SHOULD NOT GET HERE');
            }
        }
        return finished != -1;
    }

    io.on('connection', (socket) => {

        socket.on('request rooms', function () {
            io.emit('RECEIVE_ROOM', [...roomManager.keys()]);
        });

        socket.on('join', (username, room) => {
            console.log(`${username} joining room '${room}'`);
            socket.join(room);
            // socket.join(socket.id);
            player = new Player(username);
            gameroom = null;

            // Create Room
            if (!roomManager.has(room)) {
                gameroom = new GameRoom(room, player);
                roomManager.set(room, gameroom);
                rooms = [...roomManager.keys()];
                io.emit('RECEIVE_ROOM', rooms);
                socket.emit('message que', gameroom.getMessageQue());
                socket.emit('get players', gameroom.getAllPlayerNames());
                // socket.emit('is host', true);
            }
            // Room Already Created
            else {
                gameroom = roomManager.get(room);
                gameroom.joinPlayer(player);
                socket.emit('message que', gameroom.getMessageQue());
                socket.to(room).broadcast.emit('message que', gameroom.getMessageQue());
                socket.to(room).broadcast.emit('get players', gameroom.getAllPlayerNames());
                socket.emit('get players', gameroom.getAllPlayerNames());
                // socket.emit('is host', false);
            }

            socket.emit('player info', player);
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

            if (!gameroom) {
                return;
            }

            gameroom.addMessage(username, message);
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            socket.emit('message que', gameroom.getMessageQue());
        });

        socket.on('wolf message', (message) => {
            console.log("wolf messaging");
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            if (!gameroom) {
                return;
            }

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

            if (!gameroom) {
                return;
            }

            gameroom.init_game();

            // send players info
            let players = gameroom.getPlayers();
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

            if (gameroom.getNight() || !gameroom) {
                return;
            }
            gameroom.setNight(true);
            gameroom.setVoting(false);
            gameroom.nextNight();

            // update message
            gameroom.addMessage('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            gameroom.addWolfMsg('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            gameroom.addSeerMsg('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            gameroom.addWitchMsg('JUDGE', `NIGHT ${gameroom.getNightNum()}`)
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            socket.emit('message que', gameroom.getMessageQue());
            // update wolves
            let wolves = gameroom.getWolves();
            gameroom.addAbilitiesOnProcess();
            for (let i = 0; i < wolves.length; i++) {
                let s_id = usermap.get(wolves[i].getUsername());
                if (i == wolves.length - 1) {
                    if (s_id == socket.id) {
                        socket.emit('wolves kill');
                        socket.emit('options', gameroom.getAbilityOptions());
                    }
                    else {
                        socket.broadcast.to(s_id).emit('wolves kill');
                        socket.broadcast.to(s_id).emit('options', gameroom.getAbilityOptions());
                    }
                }
                if (s_id == socket.id)
                    socket.emit('message que', gameroom.getWolfQue());
                else
                    socket.broadcast.to(s_id).emit('message que', gameroom.getWolfQue());
            }
            // update seer
            let seer = gameroom.getSeer();
            if (seer && seer.isAlive()) {
                gameroom.addAbilitiesOnProcess();
                let s_id = usermap.get(seer.getUsername());
                if (s_id == socket.id) {
                    socket.emit('message que', gameroom.getSeerQue());
                    socket.emit('seer test');
                    socket.emit('options', gameroom.getAbilityOptions());
                }
                else {
                    socket.broadcast.to(s_id).emit('message que', gameroom.getSeerQue());
                    socket.broadcast.to(s_id).emit('seer test');
                    socket.broadcast.to(s_id).emit('options', gameroom.getAbilityOptions());
                }
            }
            // update witch
            let witch = gameroom.getWitch();
            if (witch && witch.isAlive()) {
                gameroom.setWitchFunctioned(false);
                if (gameroom.getPotion() || gameroom.getPoison()) {
                    gameroom.addAbilitiesOnProcess();
                }
                if (gameroom.getPoison()) {
                    let s_id = usermap.get(witch.getUsername());
                    if (s_id == socket.id) {
                        socket.emit('message que', gameroom.getWitchQue());
                        socket.emit('witch kill');
                        socket.emit('options', gameroom.getAbilityOptions());
                    }
                    else {
                        socket.broadcast.to(s_id).emit('message que', gameroom.getWitchQue());
                        socket.broadcast.to(s_id).emit('witch kill');
                        socket.broadcast.to(s_id).emit('options', gameroom.getAbilityOptions());
                    }
                }
            }
            // update button
            socket.emit('game proceeds', 'during night');
            socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'during night');

        });

        socket.on('wolves kill', id => {
            console.log(`Player ${id} has been attacked.`);
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            if (!gameroom) {
                return;
            }

            if (id != 0) {
                // killing player
                gameroom.addWolfMsg('JUDGE', `Killing player ${id}`);
                gameroom.addPlayersGotKilled(id, 'wolf');
                // if still have potion tell witch who died
                let witch = gameroom.getWitch();
                if (witch && witch.isAlive() && gameroom.getPotion()) {
                    let s_id = usermap.get(witch.getUsername());
                    socket.broadcast.to(s_id).emit('witch save', id);
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
                socket.emit('game proceeds', 'Starting the day');
                socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'Starting the day');
            }
        });

        socket.on('witch save', id => {
            console.log(`Player ${id} has been attacked. Saving him?`);
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom) {
                return;
            }
            // potion not used
            if (id == 0) {
                gameroom.addWitchMsg('JUDGE', `You have chose not to use the potion`);
                socket.emit('message que', gameroom.getWitchQue());
            }
            // check if witch has functioned
            else if (id != 0 && gameroom.getWitchFunctioned()) {
                gameroom.addWitchMsg('JUDGE', `Only one potion per night please`);
                socket.emit('message que', gameroom.getWitchQue());
            }
            else if (id != 0 && !gameroom.getWitchFunctioned()) {
                // saving player
                gameroom.setWitchFunctioned(true);
                gameroom.usedPotion();
                gameroom.addWitchMsg('JUDGE', `You have saved player ${id}`);
                gameroom.deletePlayerGotKilled(id);
                socket.emit('message que', gameroom.getWitchQue());
                // update on process abilities
                gameroom.deleteAbilitiesOnProcess();
                if (gameroom.checkAbilitiesStatus()) {
                    socket.emit('game proceeds', 'Starting the day');
                    socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'Starting the day');
                }
            }
        });

        socket.on('witch kill', id => {
            console.log(`Player ${id} has been poisoned.`);
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom) {
                return;
            }
            // poison not used
            if (id == 0) {
                gameroom.addWitchMsg('JUDGE', `You have chose not to use the poison`);
                socket.emit('message que', gameroom.getWitchQue());
            }
            // check if witch has functioned
            else if (id != 0 && gameroom.getWitchFunctioned()) {
                gameroom.addWitchMsg('JUDGE', `Only one potion per night please`);
                socket.emit('message que', gameroom.getWitchQue());
            }
            else if (id != 0 && !gameroom.getWitchFunctioned()) {
                // killing player
                gameroom.addWitchMsg('JUDGE', `Poisoning player ${id}`);
                gameroom.addPlayersGotKilled(id, 'witch');
                socket.emit('message que', gameroom.getWitchQue());
                // turn witches' ability
                gameroom.usedPoison();
                gameroom.setWitchFunctioned(true);
                socket.emit('player info', gameroom.getWitch());
                // update on process abilities
                gameroom.deleteAbilitiesOnProcess();
                if (gameroom.checkAbilitiesStatus()) {
                    socket.emit('game proceeds', 'Starting the day');
                    socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'Starting the day');
                }
            }
        });

        socket.on('seer test', id => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom) {
                return;
            }

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
                socket.emit('game proceeds', 'Starting the day');
                socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'Starting the day');
            }
        });

        socket.on('revenge', (id) => {
            console.log(`REVENGE ON PLAYER ${id}`);
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom) {
                return;
            }

            let player = gameroom.getPlayerByUsername(username);
            socket.emit('player info', player);
            // bring someone down
            if (id != 0) {
                let personGotKilled = gameroom.getPlayerByID(id);

                gameroom.addMessage('JUDGE', `Revenge brings player ${id} down.`);
                gameroom.killPlayer(id);

                let s_id = usermap.get(personGotKilled.getUsername());
                if (personGotKilled.getAbility() == 'revenge') {
                    gameroom.addMessage('JUDGE', `Player ${id}, revenge activated`);
                    socket.broadcast.to(s_id).emit('revenge');
                    socket.broadcast.to(s_id).emit('options', gameroom.getAbilityOptions());
                }
                else {
                    socket.broadcast.to(s_id).emit('player info', personGotKilled);
                }

                let finished = checkWinning(gameroom);
                if (finished) {
                    socket.emit('game proceeds', 'restart');
                    socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'restart');
                }
                socket.emit('message que', gameroom.getMessageQue());
                socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            }
            // bring no one
            else {
                gameroom.addMessage('JUDGE', `Revenge disactivated.`);

                socket.emit('message que', gameroom.getMessageQue());
                socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            }
            socket.emit('player info', player);

            socket.emit('get players', gameroom.getAllPlayerNames());
            socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
        });

        socket.on('challenge', id => {
            console.log(`Challengin Player ${id}`);
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom || id == 0) {
                return;
            }

            gameroom.setChallenged(true);
            gameroom.addMessage('JUDGE', `The Knight is challenging player ${id}`);
            let side = gameroom.getSide(id);

            switch (side) {
                case -1:
                    gameroom.addMessage('JUDGE', `Player ${id} is a werewolf!! Werewolf dies!!`);
                    let personGotKilled = gameroom.getPlayerByID(id);
                    gameroom.killPlayer(id);

                    let s_id = usermap.get(personGotKilled.getUsername());
                    socket.broadcast.to(s_id).emit('player info', personGotKilled);
                    break;
                default:
                    gameroom.addMessage('JUDGE', `Player ${id} is not a werewolf!! Knight dies!!`);
                    let player = gameroom.getPlayerByUsername(username);
                    gameroom.killPlayer(player.getPlayerID());

                    socket.emit('player info', player);
            }
            let finished = checkWinning(gameroom);
            if (finished) {
                socket.emit('game proceeds', 'restart');
                socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'restart');
            }
            socket.emit('message que', gameroom.getMessageQue());
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());

        })

        socket.on('starting the day', () => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom) {
                return;
            }
            // update players got killed list
            gameroom.setNight(false);
            gameroom.setVoteRound(1);
            let playersGotKilled = gameroom.getPlayersGotKilled();
            let isFinished = false;
            [...playersGotKilled.keys()].forEach(player => {
                let personGotKilled = gameroom.getPlayerByID(player);
                gameroom.addMessage('JUDGE', `Player ${player} got killed`);
                gameroom.killPlayer(player);
                gameroom.deletePlayerGotKilled(player);

                let s_id = usermap.get(personGotKilled.getUsername());
                if (s_id == socket.id) {
                    if (personGotKilled.getAbility() == 'revenge' && playersGotKilled.get(player) != 'witch') {
                        gameroom.addMessage('JUDGE', `Player ${player}, revenge activated`);
                        socket.emit('revenge');
                        socket.emit('options', gameroom.getAbilityOptions());
                    }
                    else {
                        socket.emit('player info', personGotKilled);
                    }
                }
                else {
                    if (personGotKilled.getAbility() == 'revenge' && playersGotKilled.get(player) != 'witch') {
                        gameroom.addMessage('JUDGE', `Player ${player}, revenge activated`);
                        socket.broadcast.to(s_id).emit('revenge');
                        socket.broadcast.to(s_id).emit('options', gameroom.getAbilityOptions());
                        gameroom.savePlayer(player);
                    }
                    else {
                        socket.broadcast.to(s_id).emit('player info', personGotKilled);
                    }
                }
                // check for winning
                if (!isFinished)
                    isFinished = checkWinning(gameroom);
            });

            socket.emit('get players', gameroom.getAllPlayerNames());
            socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
            // game finished
            if (isFinished) {
                socket.emit('message que', gameroom.getMessageQue());
                socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
                socket.emit('game proceeds', 'restart');
                socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'restart');
                return;
            }
            // activate the morning character's ability
            if (gameroom.getChallenged()) {
                let knight = gameroom.getKnight();
                console.log('knight: ', knight);
                let s_id = usermap.get(knight.getUsername());
                if (s_id == socket.id) {
                    socket.emit('challenge');
                    socket.emit('options', gameroom.getAbilityOptions());
                }
                else {
                    socket.to(s_id).broadcast.emit('challenge');
                    socket.to(s_id).broadcast.emit('options', gameroom.getAbilityOptions());
                }
            }
            // choose random player to start
            var alivePlayers = gameroom.getAbilityOptions();
            let random = Math.round(Math.random() * (alivePlayers.length - 1));
            var startPlayer = alivePlayers[random];
            // update frontend
            gameroom.addMessage('JUDGE', `Starting with player ${startPlayer.id}`);
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
            socket.emit('message que', gameroom.getMessageQue());
            socket.emit('game proceeds', 'start voting');
            socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'start voting');
        });

        socket.on('start voting', () => {
            console.log('socket emit voting');
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom || gameroom.getVoting()) {
                return;
            }

            gameroom.setVoting(true);
            gameroom.setVoteNum()
            if (gameroom.getVoteRound() == 1) {
                socket.emit('options', gameroom.getAbilityOptions());
                socket.to(gameroom.getRoomName()).broadcast.emit('options', gameroom.getAbilityOptions());
            }
            else {
                let allPlayers = gameroom.getAbilityOptions().map(player => (player.id));
                let options = gameroom.getMostVoted();
                let votees = gameroom.getMostVoted().map((id) => {
                    let player = gameroom.getPlayerByID(id);
                    return {
                        name: `Player ${player.getPlayerID()}: ${player.getUsername()}`,
                        id: player.getPlayerID()
                    }
                })
                for (let i = 0; i < allPlayers.length; i++) {
                    let player = gameroom.getPlayerByID(allPlayers[i]);
                    console.log('player: ', allPlayers[i]);
                    if (!options.includes(allPlayers[i])) {
                        console.log('new voter');
                        let s_id = usermap.get(player.getUsername());
                        if (s_id == socket.id)
                            socket.emit('options', votees);
                        else
                            socket.to(s_id).broadcast.emit('options', votees);
                    }
                    else {
                        console.log('votee can not vote');
                        let s_id = usermap.get(player.getUsername());
                        if (s_id == socket.id)
                            socket.emit('options', []);
                        else
                            socket.to(s_id).broadcast.emit('options', []);
                    }
                }
            }

            socket.emit('voting');
            socket.to(gameroom.getRoomName()).broadcast.emit('voting');
            socket.emit('game proceeds', 'voting');
            socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'voting');
        });

        socket.on('voting', (id) => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);
            if (!gameroom) {
                return;
            }
            console.log('voting for round: ', gameroom.getVoteRound());
            // set vote
            let c_id = gameroom.getPlayerID(username); // voter id
            gameroom.vote(id);
            gameroom.addMessage("JUDGE", `Player ${c_id} voted for player ${id}`);
            // if everyone has voted, inform host and update the front
            if (gameroom.checkIfVoted()) {
                socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
                socket.emit('message que', gameroom.getMessageQue());
                // check for most voted
                let voteResult = gameroom.getMostVoted();
                // no one got voted out
                if (voteResult.length == 0) {
                    gameroom.addMessage("JUDGE", "No one got voted out");
                }
                // there is a tie at round 1
                else if (voteResult.length > 1 && gameroom.getVoteRound() == 1) {
                    // update message que
                    gameroom.addMessage("JUDGE", "THERE IS A TIE!! START THE DEBATE!!");
                    gameroom.setVoting(false);
                    gameroom.setVoteRound(2);
                    socket.emit('message que', gameroom.getMessageQue());
                    socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());
                    // update frontend by players
                    for (let i = 0; i < voteResult.length; i++) {
                        let s_id = usermap.get(gameroom.getPlayerByID(voteResult[i]).getUsername());
                        if (s_id == socket.id)
                            socket.emit('game proceeds', 'wait for voting');
                        else
                            socket.broadcast.to(s_id).emit('game proceeds', 'wait for voting');
                    }
                    socket.emit('game proceeds', 'start voting');
                    socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'start voting');
                    return;
                }
                // there is a tie at round 2
                else if (voteResult.length > 1 && gameroom.getVoteRound() == 2) {
                    gameroom.addMessage("JUDGE", "It is still a tie. No one got hung");
                }
                // there is one person got hung
                else if (voteResult.length == 1) {
                    let personGotKilled = gameroom.getPlayerByID(voteResult[0]);

                    gameroom.addMessage("JUDGE", `Player ${voteResult[0]} got the most votes. HANG HIM!!!`);
                    gameroom.killPlayer(voteResult[0]);

                    let s_id = usermap.get(personGotKilled.getUsername());
                    if (s_id == socket.id) {
                        if (personGotKilled.getAbility() == 'revenge') {
                            gameroom.addMessage('JUDGE', `Player ${voteResult[0]}, revenge activated`);
                            socket.emit('revenge');
                            socket.emit('options', gameroom.getAbilityOptions());
                        }
                        else {
                            socket.emit('player info', personGotKilled);
                        }
                    }
                    else {
                        if (personGotKilled.getAbility() == 'revenge') {
                            gameroom.addMessage('JUDGE', `Player ${voteResult[0]}, revenge activated`);
                            socket.broadcast.to(s_id).emit('revenge');
                            socket.broadcast.to(s_id).emit('options', gameroom.getAbilityOptions());
                        }
                        else {
                            socket.broadcast.to(s_id).emit('player info', personGotKilled);
                        }
                    }

                    socket.emit('get players', gameroom.getAllPlayerNames());
                    socket.to(gameroom.getRoomName()).broadcast.emit('get players', gameroom.getAllPlayerNames());
                    // check for winning
                    let finished = checkWinning(gameroom);
                    if (finished) {
                        socket.emit('message que', gameroom.getMessageQue());
                        socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());

                        socket.emit('game proceeds', 'restart');
                        socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'restart');
                        return;
                    }
                }
                gameroom.setVoting(false);
                socket.emit('message que', gameroom.getMessageQue());
                socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());

                socket.emit('game proceeds', 'into the night');
                socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'into the night');
            }
        });

        socket.on('restart', () => {
            username = sockmap.get(socket.id);
            gameroom = userroom.get(username);

            gameroom.reset();

            socket.emit('message que', gameroom.getMessageQue());
            socket.broadcast.to(gameroom.getRoomName()).emit('message que', gameroom.getMessageQue());

            socket.emit('game proceeds', 'assign roles');
            socket.broadcast.to(gameroom.getRoomName()).emit('game proceeds', 'assign roles');
        })

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
                    // socket.broadcast.to(usermap.get(gameroom.getHost())).emit('is host', true);
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
                    // socket.broadcast.to(usermap.get(gameroom.getHost())).emit('is host', true);

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