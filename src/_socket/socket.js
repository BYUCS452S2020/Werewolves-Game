import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";
const socket = socketIOClient.connect(ENDPOINT)

export default function () {

    function getRoomsHandler(cb) {
        socket.on("RECEIVE_ROOM", cb);
    }

    function getMsgQueHandler(cb) {
        socket.on("message que", cb);
    }

    function getPlayersHandler(cb) {
        socket.on("get players", cb);
    }

    function getPlayerInfoHandler(cb) {
        socket.on("player info", cb);
    }

    function getIsHostHandler(cb) {
        socket.on("is host", cb);
    }

    function getProcessHandler(cb) {
        socket.on('game proceeds', cb);
    }

    function getWitchSaveHandler(cb) {
        socket.on('witch save', cb);
    }

    function getWolvesKillHandler(cb) {
        socket.on('wolves kill', cb);
    }

    function getWitchKillHandler(cb) {
        socket.on('witch kill', cb);
    }

    function getSeerTestHandler(cb) {
        socket.on('seer test', cb);
    }

    function getVotingHandler(cb) {
        socket.on('voting', cb);
    }

    function sendChatMsg(msg) {
        socket.emit("chat message", msg);
    }

    function sendWolfMsg(msg) {
        socket.emit("wolf message", msg);
    }

    function join(username, room) {
        socket.emit('join', username, room);
    }

    function leave() {
        socket.emit('leave');
    }

    function requestRooms() {
        socket.emit('request rooms', );
    }

    function assignRoles() {
        socket.emit('start game');
    }

    function intoTheNight() {
        socket.emit('into the night');
    }

    function wolvesKill(id) {
        socket.emit('wolves kill', id);
    }

    function witchSave(id) {
        socket.emit('witch save', id);
    }

    function witchKill(id) {
        socket.emit('witch kill', id);
    }

    function seerTest(id) {
        socket.emit('seer test', id);
    }

    function startingTheDay() {
        socket.emit('starting the day');
    }

    function startingVote() {
        socket.emit('start voting');
    }

    function vote(id) {
        socket.emit('voting', id);
    }
    

    return {
        getRoomsHandler,
        getMsgQueHandler,
        getPlayersHandler,
        getPlayerInfoHandler,
        getIsHostHandler,
        getProcessHandler,
        getWitchSaveHandler,
        getWolvesKillHandler,
        getWitchKillHandler,
        getSeerTestHandler,
        getVotingHandler,
        sendChatMsg,
        sendWolfMsg,
        leave,
        join,
        requestRooms,
        assignRoles,
        intoTheNight,
        wolvesKill,
        witchSave,
        witchKill,
        seerTest,
        startingTheDay,
        startingVote,
        vote
    }
}
