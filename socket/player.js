module.exports = class Player {

    // setPlayerID()
    // getPlayerID()
    // getUsername()
    // isAlive()
    // getKilled()
    // getSaved()
    // getVote()
    // setVote(votee_id)
    // getSide()
    // setSide(side)
    // getCharacter() 
    // getAbility()
    // setCharacter(char) 
    // setAbility(ability) {

    constructor(username) {
		this.username = username;
		this.alive = true;
		this.side = 0;
		this.character = 'not started';
		this.ability = null;
        this.player_id = 1;
    }

    reset() {
		this.alive = true;
		this.side = 0;
		this.character = 'not started';
		this.ability = null;
    }

    setPlayerID(id) {
        this.player_id = id;
    }

    getPlayerID() {
        return this.player_id;
    }
    
    getUsername() {
        return this.username;
    }

    isAlive() {
        return this.alive;
    }

    getKilled() {
        this.alive = false;
    }

    getSaved() {
        this.alive = true;
    }

    getVote() {
        return this.vote;
    }

    setVote(votee_id) {
        this.vote = votee_id;
    }

    getSide() {
        return this.side;
    }

    setSide(side) {
        this.side = side;
    }

    getCharacter() {
        return this.character;
    }

    getAbility() {
        return this.ability;
    }

    setCharacter(char) {
        this.character = char.name;
        this.ability = char.ability;
        this.side = char.side;
    }

    setAbility(ability) {
        this.ability = ability;
    }

}