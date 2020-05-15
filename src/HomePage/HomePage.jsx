import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';
function HomePage() {
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.authentication.user);
    // const loggingOut = useSelector(state => state.authentication.loggingOut);
    const dispatch = useDispatch();
    /*test */
    const items = [...Array(100)].map((val, i) => `Item ${i}`);
    /*css for test */
    const container = {
        display: 'flex',
        flexDirection: 'row',
        height: '80vh',
        width: '50vw',
        marginLeft: '-10em',
    };
    const centerCol  = {
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
    }, []);

    function handleDeleteUser(id) {
        dispatch(userActions.delete(id));
    }

    return (
        <div >
            <h1>LOBBY...</h1>

            <div style = {container}>
                
                <div style = {centerCol}>
                <span>List</span>
                <ul style = {listColor}>
                    {/* <div>Welcome {user.firstName}</div> */}
                    {items.map((item, i) => (<li key={`item_${i}`}>{ item }</li>))}
                </ul>
                </div>
                <p style = {logOut}>
                <button className="btn btn-primary">
                <Link style = {logOut2} to="/login">Logout</Link>
                    </button>
                
                </p>
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