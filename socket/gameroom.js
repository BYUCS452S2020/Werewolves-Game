const character = require('../_helpers/characters');
class gameroom {

    // // for message
    // getRoomName()
    // getHost()
    // getPlayers()
    // isEmpty()
    // joinPlayer(player)
    // deletePlayer(username)
    // getAllPlayerNames()
    // getMessageQue()
    // addMessage(message)


    // // for game
    // killPlayer(id)
    // savePlayer(id)
    // getSide(id)
    // getPlayerID(username)
    // checkWinning() werewolves win: 1, good guys win: 0, not finished: -1
    // init_game() 

    constructor(room_name, player) {
        this.name = room_name;
        this.host = player.username;
        this.players = [player];
        this.observers = [];
        this.gameType = "default";
        this.started = false;
        this.messageque = [
            {
                username: 'JUDGE',
                message: `${player.username} created the room`
            }
        ];
        this.cur_players = {
            total_players: 1,
            werewolves: 0,
            villagers: 1,
            specialCharacters: 0
        }
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
        if (!this.started && this.players.length <= 12) {
            player.setPlayerID(this.players.length + 1);
            this.players.push(player);
        }
        else {
            this.observers.push(player);
        }
        this.messageque.push({
            username: 'JUDGE',
            message: `${player.username} joined the room`
        });
    }

    deletePlayer(username) {
        this.players = this.players.filter(player => player.username != username);
        this.messageque.push({
            username: 'JUDGE',
            message: `${username} has left the room`
        });
        if (username == this.host && this.players.length != 0) {
            this.host = this.players[0].getUsername();
        }
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

    killPlayer(id) {
        this.players[id - 1].getKilled();
        switch (this.players[id - 1].getSide()) {
            case -1:
                this.cur_players.werewolves -= 1;
                break;
            case 0:
                this.cur_players.villagers -= 1;
                break;
            case 1:
                this.cur_players.specialCharacters -= 1;
                break;
        }
        this.cur_players.total_players -= 1;
    }

    savePlayer(id) {
        this.players[id - 1].getSaved();
    }

    getSide(id) {
        return this.players[id - 1].getSide();
    }

    getPlayerID(username) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getUsername() == username)
                return this.players[i].getPlayerID();
        }
        return 0;
    }

    prepCharacters() {
        this.cur_players.total_players = this.players.length;
        var mode = this.cur_players.total_players % 3;
        var num = (this.cur_players.total_players / 3) | 0;

        if (mode == 0) {
            this.cur_players.villagers = num;
            this.cur_players.specialCharacters = num;
            this.cur_players.werewolves = num;
        }
        else if (mode == 1) {
            this.cur_players.villagers = num + 1;
            this.cur_players.specialCharacters = num;
            this.cur_players.werewolves = num;
        }
        else if (mode == 2) {
            this.cur_players.villagers = num;
            this.cur_players.specialCharacters = num + 1;
            this.cur_players.werewolves = num + 1;
        }
    }

    init_game() {
        this.started = true;
        this.prepCharacters();
        // console.log("chars: ", this.cur_players);
        let list = []
        for (let i = 0; i < this.cur_players.total_players; i++) {
            list.push(i);
        }
        list = list
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        // console.log("characters: ", character);
        for (let i = 0; i < this.cur_players.werewolves; i++) {
            let temp = 1;
            if (i < 1)
                temp = 0;
            this.players[list.pop()].setCharacter(character.Werewolves[temp]);
        }
        // console.log("after Werewolf: ", this.players);
        for (let i = 0; i < this.cur_players.villagers; i++) {
            this.players[list.pop()].setCharacter(character.Villager);
        }
        // console.log("after Villager: ", this.players);

        for (let i = 0; i < this.cur_players.specialCharacters; i++) {
            this.players[list.pop()].setCharacter(character.SpecialCharacters[i]);
        }
        console.log("after init: ", this.players);

    }

    checkWinning() {
        let w = this.cur_players.werewolves;
        let v = this.cur_players.villagers;
        let s = this.cur_players.specialCharacters;

        if (w == 0) {
            this.started = false;
            return 1;
        }
        if (v == 0 || s == 0) {
            this.started = false;
            return 0;
        }
        else {
            return -1;
        }
    }
}

module.exports = gameroom;