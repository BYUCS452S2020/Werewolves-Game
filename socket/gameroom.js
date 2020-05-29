module.exports = class gameroom {

    // getRoomName()
    // getHost()
    // getPlayers()
    // isEmpty()
    // joinPlayer(player)
    // deletePlayer(username)
    // getAllPlayerNames()
    // getMessageQue()
    // addMessage(message)

    constructor(room_name, player) {
        this.name = room_name;
        this.host = player.username;
        this.players = [ player ];
        this.observers = [];
        this.gameType = "default";
        this.started = false;
        this.messageque = [
            {
                username: player.username,
                message: `${player.username} created the room`
            }
        ];
        
    }

    getRoomName() {
        return this.name;
    }

    getHost() {
        return this.host;
    }

    getPlayers() {
        return this.players;
    }

    isEmpty() {
        return this.players.length == 0;
    }

    joinPlayer(player) {
        if (!this.started) {
            this.players.push(player);
        }
        else {
            this.observers.push(player);
        }
        this.messageque.push({
            username: player.username,
            message: `${player.username} joined the room`
        });
    }

    deletePlayer(username) {
        this.players = this.players.filter(player => player.username != username);
    }

    getAllPlayerNames() {
        return this.players.map(player => player.username);
    }

    getMessageQue() {
        return this.messageque;
    }

    addMessage(username, message) {
        this.messageque.push({
            username: username,
            message: message
        });
    }
}