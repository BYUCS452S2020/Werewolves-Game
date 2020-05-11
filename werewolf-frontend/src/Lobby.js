import React, { useState, useEffect } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";

function Lobby() {
    console.log("into Lobby");
    const [response, setResponse] = useState("");

    useEffect(() => {
      const socket = socketIOClient(ENDPOINT);
      socket.on("FromAPI", data => {
        setResponse(data);
      });
    }, []);
  return (
    <div>
      <h1> Lobby </h1>
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
    </div>
  );
}

export default Lobby;
