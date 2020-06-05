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

    constructor(username, character = 'not started', ability = null, player_id = 1, ability_time = 2) {
		this.username = username;
		this.vote = 0;
		this.alive = true;
		this.side = 0;
		//unique value for the character-player pair
		this.character = character;
		this.ability = ability;
        this.player_id = player_id;
        this.ability_time = ability_time;
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