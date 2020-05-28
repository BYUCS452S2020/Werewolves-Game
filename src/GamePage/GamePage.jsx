import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4002";
import { userActions } from '../_actions';

import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        position: 'fixed',
        top: '8em',
        left: '38px'
    },
    root2: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        position: 'fixed',
        top: '8em',
        right: '70px'
    },
    gridList: {
        width: '300px',
        height: '400px',

    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    button: {
        display: 'block',
        marginTop: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(1),
        width: '300px'
    },
}));

const tileData = [
    {
        img: '/idiot.jpg',
        title: 'Idiot',
        description: 'Just an idiot...',
    },
    {
        img: '/werewolves.jpg',
        title: 'Werewolves',
        description: 'Wakes up at night. Vote to kill 1 person',
    },
    {
        img: '/seer.jpg',
        title: 'Seer',
        description: 'Looks into the future. Picks 1 person to know identity',
    },
    {
        img: '/hunter.jpg',
        title: 'Hunter',
        description: 'Choose another player to kill upon death',
    },
    {
        img: '/wolfKing.jpg',
        title: 'Wolf King',
        description: 'Bigger Wolf... gets 2 votes',
    },
    {
        img: '/witch.jpg',
        title: 'Witch',
        description: 'Holds 2 vials. 1 to save. 1 to poison',
    },
    {
        img: '/knight.jpg',
        title: 'Knight',
        description: 'DayTime can challenge peoples identity',
    },
    {
        img: '/Peasant.jpg',
        title: 'Peasant',
        description: 'Does nothing....',
    },
];


const scrollData = [
    {
        value: "",
        description: 'None'
    },
    {
        value: '10',
        description: 'Vote'
    },
    {
        value: '20',
        description: 'Ability 2'
    },
    {
        value: '30',
        description: 'Ability 3'
    },
];


function GamePage(props) {
    const classes = useStyles();

    const [age, setAge] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const room = props.location.state.room;
    const socket = socketIOClient(ENDPOINT);
    const user = useSelector(state => state.authentication.user);
    socket.emit("join", user.data.username, room);
    // const loggingOut = useSelector(state => state.authentication.loggingOut);
    const dispatch = useDispatch();

    var temp = [];
    socket.on("message que", data => {
        temp = data;
    })
    /*test */
    const [msgs, setMsgs] = useState(temp);
    const [msg, setMsg] = useState("");
    var items = [...msgs].map((val, i) => msgs[i]);

    /*css for test */
    const container = {
        display: 'flex',
        flexDirection: 'row',
        height: '60vh',
        width: '49.90vw',
        paddingRight: '2em',
    };
    const centerCol = {
        flex: '1',
        background: '#cfe8fc',
        overflowY: 'scroll'
    };

    const listColor = {
        color: 'white',
        marginTop: '2em'
    };

    const logOut = {
        position: 'fixed',
        top: '30px',
        left: '38px',
    };

    const logOut2 = {
        color: 'black'
    };

    const redH1 = {
        color: 'red',
        paddingTop: '.5em',
        textAlign: 'center'
    };

    const center = {
        marginLeft: '6.5em',
    };

    const formCenter = {
        marginLeft: '8em',
        marginBottom: '3em'
    };

    const listRoom = {
        marginBottom: '1em',
        color: 'white'
    };

    const leftAlign = {
        position: 'relative',
        left: '60px',
    };

    const marginBottom = {
        marginBottom: '1em'
    };

    const chatBox = {
        margin: '0',
        padding: '0',
        boxSizing: 'border-box'
    };

    const chatFont = {
        font: '13px Helvetica, Arial'
    };

    const chatForm = {
        background: 'white',
        padding: '3px',
        position: 'fixed',

        width: '30%'
    };

    const chatFormInput = {
        border: '0',
        padding: '10px',
        width: '90%',
        marginRight: '0.5%'
    };

    const chatFormButton = {
        width: '9.5%',
        background: 'rgb(130, 224, 255)',
        border: 'black',
        paddingTop: '10px',
        paddingBottom: '10px',

        whiteSpace: 'noWrap',
    };

    const message = {
        listStyleType: 'square',
        margin: '10',
        padding: '10'
    };

    const whiteText = {
        color: 'red'
    };

    const centerText = {
        textAlign: 'center'
    };

    useEffect(() => {
        dispatch(userActions.getAll());
        handleGetMsg();
    }, []);

    function handleGetMsg() {
        socket.on("chat message", (username, msg) => {
            console.log("username, msg: ", username, msg);
            temp.push({username, msg});
            setMsgs(temp);
        });
        console.log("msgs: ",msgs);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (!msg) {
            return alert("msg can't be empty");
        }
        socket.emit("chat message", msg, room);
    };



    return (
        <div style={center}>
            {/* logout button */}
            <button className="btn btn-primary" style={logOut}>
                <Link style={logOut2} to="/">Go Back</Link>
            </button>

            {/* title */}
            <h1 style={redH1}>{user.data.username}'s Character: Werewolf</h1>

            {/* Ability drop down */}
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel style={whiteText} id="demo-controlled-open-select-label">Abilities</InputLabel>
                    <Select style={whiteText}
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                        value={age}
                        onChange={handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Vote</MenuItem>
                        <MenuItem value={20}>Ability 2</MenuItem>
                        <MenuItem value={30}>Ability 3</MenuItem>

                        {/* {scrollData.map((scroll) => (
                        <MenuItem key={scroll.value}>
                         <div>{scroll.description}</div>
                        </MenuItem>
                        ))} */}

                    </Select>
                </FormControl>
            </div>

            {/* list of characters description */}
            <div className={classes.root}>
                <GridList cellHeight={150} className={classes.gridList}>
                    {tileData.map((tile) => (
                        <GridListTile key={tile.img}>
                            <img src={tile.img} alt={tile.title} />
                            <GridListTileBar
                                title={tile.title}
                                subtitle={<span>by: {tile.description}</span>}
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>

            {/* list of players */}
            <div className={classes.root2}>
                <div>
                    <h3 style={listRoom}>List of Players</h3>
                    <ul style={listColor}>
                        {items.map((item, i) => (<li style={marginBottom} key={`item_${i}`}>{user.data.username}
                        </li>))}
                    </ul>
                </div>
            </div>

            {/* chat container */}
            <div style={container}>
                <div style={centerCol}>
                    <h1 style={centerText}> Chat </h1>
                    <ul style={message}>
                        {items.map((item, i) => (<li style={marginBottom} key={`item_${i}`}> {item.msg} by: {item.username}
                        </li>))}
                    </ul>
                </div>
            </div>

            {/* chat submit form */}
            <form style={chatForm, chatBox} onSubmit={event => handleSubmit(event)}>
                <input
                    placeholder="type something..."
                    style={chatFormInput}
                    id="msg"
                    onChange={e => setMsg(e.target.value.trim())}
                    autoComplete="off"
                /><button type="submit" style={chatFormButton}>Send</button>
            </form>

        </div>
    );
}

export { GamePage };