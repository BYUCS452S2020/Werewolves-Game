import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";
const socket = socketIOClient.connect(ENDPOINT)

export default function () {

    function getRoomsHandler(cb) {
        socket.on("RECEIVE_ROOM", cb);
    }

    function getMsgQueHandler(cb) {
        socket.on("message que", cb)
    }

    function getPlayersHandler(cb) {
        socket.on("get players", cb)
    }

    function getPlayerInfoHandler(cb) {
        socket.on("player info", cb)
    }

    function getIsHostHandler(cb) {
        socket.on("is host", cb)
    }

    function sendChatMsg(msg) {
        socket.emit("chat message", msg);
    }

    function join(username, room) {
        socket.emit('join', username, room);
    }

    function leave() {
        socket.emit('leave')
    }

    function requestRooms() {
        socket.emit('request rooms', )
    }

    function gameProceeds() {
        socket.emit('start game')
    }


    return {
        getRoomsHandler,
        getMsgQueHandler,
        getPlayersHandler,
        getPlayerInfoHandler,
        getIsHostHandler,
        sendChatMsg,
        leave,
        join,
        requestRooms,
        gameProceeds
    }
}
