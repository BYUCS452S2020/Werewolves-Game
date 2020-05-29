import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";
import { userActions } from '../_actions';

function HomePage() {
    const socket = socketIOClient(ENDPOINT);
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    const [rooms, setRooms] = useState("");
    const [room, setRoom] = useState("");
    var items = [...rooms].map((val, i) => `${rooms[i]}`);

    const container = {
        display: 'flex',
        flexDirection: 'row',
        height: '65vh',
        width: '40vw',
        paddingRight: '5em',
        paddingLeft: '5em'
    };
    const centerCol = {
        flex: '1',
        background: 'red',
        opacity: '80%',
        overflowY: 'scroll'
    };

    const listColor = {
        color: 'white',
        marginTop: '2em'
    };

    const logOut = {
        position: 'fixed',
        top: '45px',
        left: '38px',
    };

    const logOut2 = {
        color: 'black'
    };

    const redH1 = {
        color: 'red',
        paddingTop: '1em'
    };

    const center = {
        marginLeft: '7.5em'
    };

    const formCenter = {
        marginLeft: '8em',
        marginBottom: '3em'
    };

    const listRoom = {
        marginLeft: '4em',
        marginBottom: '1em'
    };

    const leftAlign = {
        position: 'relative',
        left: '60px',
    };

    const marginBottom = {
        marginBottom: '1em'
    };

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
        <div style = {center}>
            <button className="btn btn-primary" style={logOut}>
                <Link style={logOut2} to="/login">Logout</Link>
            </button>
            <h1 style = {redH1}>Welcome {user.firstName} to the LOBBY!!!</h1>

            <form onSubmit={event => handleSubmit(event)} style = {formCenter}>
                <input
                    id="room"
                    onChange={e => setRoom(e.target.value.trim())}
                    placeholder="Name Your Room"
                />
                <button type="submit">Create</button>
            </form>

            <div style={container}>

                <div style={centerCol}>
                    <span style = {listRoom}>List of Rooms to choose from:</span>
                    <ul style={listColor}>
                        {/* <div>Welcome {user.firstName}</div> */}
                        {items.map((item, i) => (<li style = {marginBottom} key={`item_${i}`}>{item}
                            <button style = {leftAlign}>
                                <Link style={logOut2} to={{
                                    pathname: '/game',
                                    state: {
                                        room: item
                                    }
                                    }}>Click to go to room</Link>
                            </button>
                        </li>))}
                    </ul>
                </div>
                
            </div>
           

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

export { HomePage };