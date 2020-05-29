module.exports = class Player {
    constructor(username, character = null, ability = null) {
		this.username = username;
		this.vote = 0;
		this.alive = true;
		this.side = true;
		//unique value for the character-player pair
		this.character = character;
		this.ability = ability;
    }
    
    getUsername() {
        return this.username;
    }

    isAlive() {
        return this.alive;
    }

    getkilled() {
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

    setCharacter(charName, ability) {
        this.character = charName;
        this.ability = ability;
    }

}