import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";

export default function () {
    const socket = socketIOClient.connect(ENDPOINT)

    function getRoomsHandler(cb) {
        socket.on("RECEIVE_ROOM", cb);
    }

    function getMsgQueHandler(cb) {
        socket.on("message que", cb)
    }

    function getChatMsgHandler(cb) {
        socket.on("chat message", cb)
    }

    function getPlayersHandler(cb) {
        socket.on("get players", cb)
    }

    function sendChatMsg(username, msg) {
        socket.emit("chat message", username, msg);
    }

    function join(username, room) {
        socket.emit('join', username, room);
    }

    function leave(username) {
        socket.emit('leave', username)
    }


    return {
        getRoomsHandler,
        getMsgQueHandler,
        getChatMsgHandler,
        getPlayersHandler,
        sendChatMsg,
        leave,
        join
    }
}
