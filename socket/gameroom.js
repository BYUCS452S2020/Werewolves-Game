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
    // getWolfQue()
    // addWolfMsg(username, message) 
    // getNightNum() 
    // getSeerQue() {
    // addSeerMsg(username, message) {
    // getWitchQue() {
    // addWitchMsg(username, message) {


    // // for game
    // killPlayer(id)
    // savePlayer(id)
    // getSide(id)
    // getPlayerID(username)
    // checkWinning() werewolves win: 0, good guys win: 1, not finished: -1
    // init_game() 
    // getWolves()
    // nextNight() 
    // getPotion() 
    // getPoison() 
    // addPlayersGotKilled(id) {
    // getPlayersGotKilled() {
    // getSeer()
    // deletePlayerGotKilled(id){
    // usedPotion() {
    // usedPoison() {
    // addAbilitiesOnProcess() {
    // deleteAbilitiesOnProcess() {
    // checkAbilitiesStatus() {
    // vote(votee_id)
    // getVoteRound() {
    // getMostVoted() {
    // checkIfVoted() {
    // getAbilityOptions()
    // getNight() {
    // setNight(input) {
    // getVoting() {
    // setVoting(input) {
    // setVoteRound(round) {
    // getKnight() {


    constructor(room_name, player) {
        this.name = room_name;              // room name: stirng
        this.host = player.username;        // host name: string
        this.players = [player];            // player list: player[]
        this.observers = [];                // observer list: player[]
        this.gameType = "default";          // game type: not implemented
        this.started = false;               // indicate if the game has started: bool
        this.nightNum = 0;                  // i(th) night of the game: int
        this.potion = true;                 // if the potion is available: bool
        this.poison = true;                 // if the poison is available: bool
        this.witchFunctioned = false;       // only one potion at night: bool
        this.playersGotKilled = new Map();  // players got killed at night: map
        this.abilitiesOnProcess = 0;        // how many abilities are being used: int
        this.night = false;                 // if it's night: bool
        this.voting = false;                // if it's voting: bool
        this.challenged = false;                // if it's voting: bool
        this.voteNum = 0;                   // number of players voted: int
        this.messageque = [
            {
                username: 'JUDGE',
                message: `${player.username} created the room`
            }
        ];                                  // message que: {username: string, message: string}
        this.wolfque = [
            {
                username: 'JUDGE',
                message: 'werewolves only now'
            }
        ];                                  // wolves message que: {username: string, message: string}
        this.seerque = [
            {
                username: 'JUDGE',
                message: 'seer only now'
            }
        ];                                  // seer message que: {username: string, message: string}
        this.witchque = [
            {
                username: 'JUDGE',
                message: 'witch only now, wait for the werewolves to make their move'
            }
        ];                                  // witch message que: {username: string, message: string}
        this.cur_players = {
            total_players: 1,
            werewolves: 0,
            villagers: 1,
            specialCharacters: 0
        };                                  // current alive players: {int}
        this.votes = new Map();
        this.votes.set('round', 1);                    // vote dict: dict
    }

    reset() {
        this.players.forEach(player => player.reset());
        this.started = false;               // indicate if the game has started: bool
        this.nightNum = 0;                  // i(th) night of the game: int
        this.potion = true;                 // if the potion is available: bool
        this.poison = true;                 // if the poison is available: bool
        this.witchFunctioned = false;       // only one potion at night: bool
        this.playersGotKilled = new Map();         // players got killed at night: int[]
        this.abilitiesOnProcess = 0;        // how many abilities are being used: int
        this.night = false;                 // if it's night: bool
        this.voting = false;                // if it's voting: bool
        this.challenged = false;                // if it's voting: bool
        this.voteNum = 0;                   // number of players voted: int
        this.messageque = [
            {
                username: 'JUDGE',
                message: `game restarted`
            }
        ];                                  // message que: {username: string, message: string}
        this.wolfque = [
            {
                username: 'JUDGE',
                message: 'werewolves only now'
            }
        ];                                  // wolves message que: {username: string, message: string}
        this.seerque = [
            {
                username: 'JUDGE',
                message: 'seer only now'
            }
        ];                                  // seer message que: {username: string, message: string}
        this.witchque = [
            {
                username: 'JUDGE',
                message: 'witch only now, wait for the werewolves to make their move'
            }
        ];                                  // witch message que: {username: string, message: string}
        this.cur_players = {
            total_players: this.players.length,
            werewolves: 0,
            villagers: 0,
            specialCharacters: 0
        };                                  // current alive players: {int}
        this.votes = new Map();
        this.votes.set('round', 1);                    // vote dict: dict
    }

    getChallenged() {
        return this.challenged;
    }

    setChallenged(input) {
        this.challenged = input;
    }

    getWitchFunctioned() {
        return this.witchFunctioned;
    }

    setWitchFunctioned(input) {
        this.witchFunctioned = input;
    }

    setVoteNum() {
        this.voteNum = this.cur_players.total_players;
    }

    getNight() {
        return this.night;
    }

    setNight(input) {
        this.night = input;
    }

    getVoting() {
        return this.voting;
    }

    setVoting(input) {
        this.voting = input;
    }

    getPlayerByID(id) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getPlayerID() == id)
                return this.players[i];
        }
        return null;
    }

    getPlayerByUsername(username) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].getUsername() == username)
                return this.players[i];
        }
        return null;
    }

    setVoteRound(round) {
        this.votes.set('round', round);
    }

    getVoteRound() {
        return this.votes.get('round');
    }

    getMostVoted() {
        let most = 0;
        let result = [];
        [...this.votes.keys()].forEach(key => {
            let vote = this.votes.get(key);
            if (key == 0 || key == 'round') return;
            if (vote > most) {
                result = [];
                result.push(key);
                most = vote;
            }
            else if (vote == most) {
                result.push(key);
            }
        });
        return result;
    }

    checkIfVoted() {
        if (this.voteNum == 0)
            return true;
        else
            return false;
    }

    checkAbilitiesStatus() {
        if (this.abilitiesOnProcess == 0)
            return true;
        else
            return false;
    }

    addAbilitiesOnProcess() {
        this.abilitiesOnProcess += 1;
    }

    deleteAbilitiesOnProcess() {
        this.abilitiesOnProcess -= 1;
    }

    deletePlayerGotKilled(id) {
        this.playersGotKilled.delete(id);
    }

    addPlayersGotKilled(id, message) {
        if (!this.playersGotKilled.has(id))
            this.playersGotKilled.set(id, message);
    }

    getPlayersGotKilled() {
        return this.playersGotKilled;
    }

    getKnight() {
        let knight = this.players.filter(player => player.character == "Knight");
        if (knight) {
            return knight[0];
        }
        return null;
    }

    getWitch() {
        let witch = this.players.filter(player => player.character == "Witch");
        if (witch) {
            return witch[0];
        }
        return null;
    }

    getSeer() {
        let seer = this.players.filter(player => player.character == "Seer");
        if (seer) {
            return seer[0];
        }
        return null;
    }

    vote(votee_id) {
        let vNum = 1;
        if (this.votes.has(votee_id)) {
            vNum = this.votes.get(votee_id) + 1;
        }
        this.votes.set(votee_id, vNum);
        this.voteNum -= 1;
    }

    usedPoison() {
        this.poison = false;
    }

    getPoison() {
        return this.poison;
    }

    usedPotion() {
        this.potion = false;
    }

    getPotion() {
        return this.potion;
    }

    nextNight() {
        this.nightNum += 1;
    }

    getNightNum() {
        return this.nightNum;
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
        let playerNames = this.players.map(player => player.getUsername());
        if (playerNames.includes(player.getUsername())) {
            this.messageque.push({
                username: 'JUDGE',
                message: `${player.username} rejoined the room`
            });    
        }
        else if (!this.started && this.players.length <= 12) {
            player.setPlayerID(this.players.length + 1);
            this.players.push(player);
            this.messageque.push({
                username: 'JUDGE',
                message: `${player.username} joined the room`
            });    
        }
        else {
            player.setPlayerID(0);
            this.observers.push(player);
        }
    }

    deletePlayer(username) {
        this.players = this.players.filter(player => player.username != username);
        this.players = this.players.map((player, i) => {
            player.setPlayerID(i + 1);
            return player;
        });
        this.messageque.push({
            username: 'JUDGE',
            message: `${username} has left the room`
        });
        if (username == this.host && this.players.length != 0) {
            this.host = this.players[0].getUsername();
        }
    }

    getAllPlayerNames() {
        return this.players.map(player => {
            return {
                name: `Player ${player.getPlayerID()}: ${player.getUsername()}`,
                alive: player.isAlive(),
                id: player.getPlayerID()
            }
        });
    }

    getAbilityOptions() {
        return this.players
            .filter(player => player.isAlive())
            .map(player => {
                return {
                    name: `Player ${player.getPlayerID()}: ${player.getUsername()}`,
                    id: player.getPlayerID()
                }
            });
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

    getWolfQue() {
        return this.wolfque;
    }

    addWolfMsg(username, message) {
        this.wolfque.push({
            username: username,
            message: message
        });
    }
    getSeerQue() {
        return this.seerque;
    }

    addSeerMsg(username, message) {
        this.seerque.push({
            username: username,
            message: message
        });
    }
    getWitchQue() {
        return this.witchque;
    }

    addWitchMsg(username, message) {
        this.witchque.push({
            username: username,
            message: message
        });
    }

    getWolves() {
        return this.players.filter(player => player.side == -1);
    }

    getNotWolves() {
        return this.players.filter(player => player.side != -1);
    }

    killPlayer(id) {
        let player = this.players[id - 1];
        this.players[id - 1].getKilled();
        player.getKilled();
        switch (player.getSide()) {
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
        let list = []
        for (let i = 0; i < this.cur_players.total_players; i++) {
            list.push(i);
        }
        list = list
            .map((a) => ({ sort: Math.random(), value: a }))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
        for (let i = 0; i < this.cur_players.werewolves; i++) {
            let temp = 1;
            if (i < 1)
                temp = 0;
            this.players[list.pop()].setCharacter(character.Werewolves[temp]);
        }
        for (let i = 0; i < this.cur_players.villagers; i++) {
            this.players[list.pop()].setCharacter(character.Villager);
        }

        for (let i = 0; i < this.cur_players.specialCharacters; i++) {
            this.players[list.pop()].setCharacter(character.SpecialCharacters[i]);
        }

    }

    checkWinning() {
        let w = this.cur_players.werewolves;
        let v = this.cur_players.villagers;
        let s = this.cur_players.specialCharacters;

        if (this.gameType == 'default') {
            if (w == 0) {
                return 1;
            }
            if (v == 0 || s == 0) {
                return 0;
            }
            else {
                return -1;
            }
        }
    }
}

module.exports = gameroom;