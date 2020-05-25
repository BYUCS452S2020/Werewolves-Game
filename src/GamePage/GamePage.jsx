import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";
import { userActions } from '../_actions';

function GamePage(props) {
    const user = useSelector(state => state.authentication.user);
    // const loggingOut = useSelector(state => state.authentication.loggingOut);
    const dispatch = useDispatch();
    const socket = socketIOClient(ENDPOINT);
    console.log("Room:", props.location.state.room);
    /*test */
    const [rooms, setRooms] = useState("");
    const [room, setRoom] = useState("");
    var items = [...rooms].map((val, i) => `${rooms[i]}`);
    /*css for test */
    const container = {
        display: 'flex',
        flexDirection: 'row',
        height: '80vh',
        width: '50vw',
        marginLeft: '-10em',
    };
    const centerCol = {
        flex: '1',
        background: 'red',
        opacity: '80%',
        overflowY: 'scroll'
    };

    const listColor = {
        color: 'white'
    };

    const logOut = {
        position: 'fixed',
        top: '0px',
    };

    const logOut2 = {
        color: 'white'
    }

    useEffect(() => {
        dispatch(userActions.getAll());
        handleGetRooms();
    }, []);

    function handleDeleteUser(id) {
        dispatch(userActions.delete(id));
    }

    function handleGetRooms() {
        socket.on("RECEIVE_ROOM", data => {
            setRooms(data);
        });
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (!room) {
            return alert("room can't be empty");
        }
        socket.emit("SEND_ROOM", room);
    };


    return (
        <div >
            <h1>Welcome {user.data.username} to the GAME!!!</h1>

            <div style={container}>

                <div style={centerCol}>
                    <span>List</span>
                    <ul style={listColor}>
                        {/* <div>Welcome {user.firstName}</div> */}
                        {items.map((item, i) => (<li key={`item_${i}`}>{item}
                        </li>))}
                    </ul>
                </div>
                <p style={logOut}>
                    <button className="btn btn-primary">
                        <Link style={logOut2} to="/">Leave</Link>
                    </button>

                </p>
            </div>
            <form onSubmit={event => handleSubmit(event)}>
                <input
                    id="room"
                    onChange={e => setRoom(e.target.value.trim())}
                    placeholder="What is your room .."
                />
                <br />
                <button type="submit">Submit</button>
            </form>

            {/* <h2>Welcome {user.firstName}!!!</h2>
            <p>This is the Lobby</p>
            <h3>All registered users:</h3>
            {users.loading && <em>Loading users...</em>}
            {users.error && <span className="text-danger">ERROR: {users.error}</span>}
            {users.items &&
                <ul>
                    {users.items.map((user, index) =>
                        <li key={user.id}>
                            {user.firstName + ' ' + user.lastName}
                            {
                                user.deleting ? <em> - Deleting...</em>
                                : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                : <span> - <a onClick={() => handleDeleteUser(user.id)} className="text-primary">Delete</a></span>
                            }
                        </li>
                    )}
                </ul>
            }
            <p>
                <Link to="/login">Logout</Link>
            </p> */}
        </div>
    );
}

export { GamePage };