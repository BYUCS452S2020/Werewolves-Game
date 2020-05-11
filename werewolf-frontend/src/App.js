import React from 'react';
import './App.css';
import Nav from './Nav';
import Lobby from './Lobby';
import Login from './Login';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/lobby" component={Lobby}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </div>  
    </Router>
  );
}

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default App;
