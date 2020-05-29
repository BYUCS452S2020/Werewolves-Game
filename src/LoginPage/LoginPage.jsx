import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';

function LoginPage() {
    const [inputs, setInputs] = useState({
        username: '',
        password: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const { username, password } = inputs;
    const loggingIn = useSelector(state => state.authentication.loggingIn);
    const dispatch = useDispatch();


    const heroText =  {

        textAlign: 'center',
        position: 'absolute',
        marginTop: '20em',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'red'
        };
    const divStyle = {
        color: "red"
    };
    const increaseSize1 = {
        fontSize: '4em',
        position: 'relative',
        marginTop: '-.5em',
    };
    const increaseSize2 = {
        fontSize: '3em'
    };

    // reset login status
    useEffect(() => { 
        dispatch(userActions.logout()); 
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }

    return (
        <div  style = {heroText}>
            <h1 style = {increaseSize1}>Welcome!</h1>
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group" >
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
                    {submitted && !username &&
                        <div className="invalid-feedback">Username is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
                    {submitted && !password &&
                        <div className="invalid-feedback">Password is required</div>
                    }
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">
                        {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Login
                    </button>
                    <Link to="/register" style = {divStyle} className="btn btn-link">Register</Link>
                </div>
            </form>
        </div>
    );
}

export { LoginPage };