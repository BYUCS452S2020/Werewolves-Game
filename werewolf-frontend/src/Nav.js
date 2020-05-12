import React from 'react';
import './App.css';
import {Link} from 'react-router-dom'

function Nav() {
    console.log("into Nav");
    const navStyle = {
        color: 'white'
    }
  return (
    <nav> 
        <h3>Logo</h3> 
        <ul className="nav-links">
        <Link to="/lobby" style={navStyle}>
            <li>Lobby</li>
        </Link>
        <Link to="/login" style={navStyle}>
            <li>log out</li>
        </Link>
        </ul>
    </nav>

  );
}

export default Nav;
