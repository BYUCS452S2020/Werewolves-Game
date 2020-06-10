import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import socketIOClient from "socket.io-client";
// const ENDPOINT = "http://127.0.0.1:4002";
import { userActions } from '../_actions';
import socketFunction from '../_socket/socket';

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

function GamePage(props) {
    const classes = useStyles();
    const socket = socketFunction();

    const room = props.location.state.room;
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();


    const [open, setOpen] = React.useState(false);
    const [msgs, setMsgs] = useState([]);
    const [msg, setMsg] = useState('');
    const [players, setPlayers] = useState([]);
    const [player, setPlayer] = useState({ character: 'None' });
    const [gameProcess, setGameProcess] = useState('assign roles');
    const [ability, setAbility] = useState(false);
    const [options, setOptions] = useState([]);
    const [gameState, setGameState] = useState(-1); // 0: day, 1: night, 2: voting


    const handleChange = (event) => {
        // console.log("menu value: ", event.target.value);
        if (gameState == -1) {
            return alert("have not started");
        }

        if (confirm('Are you sure to choose this player?')) {
            if (gameState == 1 && player) {
                switch (player.ability) {
                    case "test":
                        socket.seerTest(event.target.value);
                        break;
                    case "save_posion":
                        socket.witchKill(event.target.value);
                        break;
                    default:
                        socket.wolvesKill(event.target.value);
                        break;
                }
            }
            else if (gameState == 0 && player) {
                switch (player.ability) {
                    case "revenge":
                        socket.revenge(event.target.value);
                        break;
                    case "challenge":
                        socket.challenge(event.target.value);
                        break;
                    default:
                        // socket.wolvesKill(event.target.value);
                        break;
                }
            }
            else if (gameState == 2 && player) {
                socket.vote(event.target.value);
                setGameState(0);
            }
            setAbility(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

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

    const startButton = {
        position: 'fixed',
        top: '30px',
        right: '38px',
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
        handleMsgQue();
        handleJoin();
        handlePlayerList();
        handlePlayerInfo();
        handleGameProceeds();
        handleWolfKill();
        handleWitchKill();
        handleSeerTest();
        handleWitchSave();
        handleRevenge();
        handleChallenge();
        handleVoting();
        handleOptions();
    }, []);

    function handleMsgQue() {
        socket.getMsgQueHandler(messageque => {
            setMsgs(messageque);
            // console.log('msg que: ', messageque);
        })
    }

    function handlePlayerList() {
        socket.getPlayersHandler(players => {
            setPlayers(players);
            // console.log('players: ', players);
        })
    }

    function handlePlayerInfo() {
        socket.getPlayerInfoHandler(player => {
            setPlayer(player);
            console.log('player: ', player);
        })
    }

    function handleOptions() {
        socket.getOptionsHandler(options => {
            if (!options) {
                setAbility(false);
                return;
            }
            setOptions(options);
            console.log('options: ', options);
        })
    }

    function handleGameProceeds() {
        socket.getProcessHandler((gameProcess) => {
            if (gameProcess == 'into the night') {
                setAbility(false);
            }
            if (gameProcess == 'during night') {
                setGameState(1);
            }
            else if (gameProcess == 'Starting the day') {
                setGameState(0);
            }
            else if (gameProcess == 'voting') {
                setAbility(true);
                setGameState(2);
            }
            else if (gameProcess == 'restart') {
                setGameState(0)
                setAbility(false);
            }
            setGameProcess(gameProcess);
        });
    }

    function handleWolfKill() {
        socket.getWolvesKillHandler(() => {
            setAbility(true);
        })
    }

    function handleWitchKill() {
        socket.getWitchKillHandler(() => {
            setAbility(true);
        })
    }

    function handleRevenge() {
        socket.getRevengeHandler(() => {
            setAbility(true);
        })
    }

    function handleChallenge() {
        socket.getChallengeHandler(() => {
            console.log('knight: ', player);
            setAbility(true);
        })
    }

    function handleWitchSave() {
        socket.getWitchSaveHandler((id) => {
            if (confirm(`Player ${id} has been attacked. Do you want to save him?`)) {
                socket.witchSave(id);
                setAbility(false);
            }
            else {
                socket.witchSave(0);
            }
        })
    }

    function handleSeerTest() {
        socket.getSeerTestHandler(() => {
            setAbility(true);
        })
    }

    function handleVoting() {
        socket.getVotingHandler(() => {
            setAbility(true);
        })
    }


    const handleSubmit = e => {
        e.preventDefault();
        if (!msg)
            return alert("msg can't be empty");
        else if (!player.alive)
            return alert("dead man can't message");
        else if (gameState == 2)
            return alert("can't message during voting");
        else if (gameState == 1 && player.side == -1)
            socket.sendWolfMsg(msg);
        else
            socket.sendChatMsg(msg);
        setMsg('');
        e.target.reset();
    };

    function handleJoin() {
        socket.join(user.username, room);
    }

    function game_proceeds() {
        if (gameProcess == 'assign roles') {
            console.log("assign roles");
            socket.assignRoles();
        }
        else if (gameProcess == 'into the night') {
            console.log("into the night", gameState);
            socket.intoTheNight();
        }
        else if (gameProcess == 'Starting the day') {
            console.log("out of the night", gameState);
            socket.startingTheDay();
        }
        else if (gameProcess == 'start voting') {
            console.log("start voting", gameState);
            socket.startingVote();
        }
        else if (gameProcess == 'restart') {
            console.log("restarting", gameState);
            socket.restart();
        }
    }


    return (
        <div style={center}>
            {/* logout button */}
            <button className="btn btn-primary" style={logOut}>
                <Link style={logOut2} to="/">Go Back</Link>
            </button>

            {/* start button */}
            {player.player_id == 1 &&
                <button className="btn btn-primary" style={startButton} type="button" onClick={game_proceeds}>
                    <div style={logOut2} >{gameProcess}</div>
                </button>
            }


            {/* title */}
            <h1 style={redH1}>{user.username}'s Character: {player.character}</h1>

            {/* Ability drop down */}
            {player.alive && ability &&
                <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel style={whiteText} id="demo-controlled-open-select-label">Abilities</InputLabel>
                        <Select style={whiteText}
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            // value={age}
                            onChange={handleChange}>
                            <MenuItem value={0}>
                                <div>None</div>
                            </MenuItem>
                            {options.map((player) =>
                                (<MenuItem value={player.id}>
                                    <div>{player.name}</div>
                                </MenuItem>)
                            )}
                        </Select>
                        <button className="btn btn-primary" style={startButton} type="button" onClick={game_proceeds}>
                            <div style={logOut2} >{gameProcess}</div>
                        </button>
                    </FormControl>
                </div>
            }

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
                        {players.map((player, i) => {
                            if (player.alive) {
                                return (<li style={marginBottom} key={`item_${i}`}>{player.name}</li>)
                            }
                            else {
                                return (<li style={marginBottom} key={`item_${i}`}><s>{player.name}</s></li>)
                            }
                        })}
                    </ul>
                </div>
            </div>

            {/* chat container */}
            <div style={container}>
                <div style={centerCol}>
                    <h1 style={centerText}> Chat </h1>
                    <ul style={message}>
                        {msgs.map((item, i) => (<li style={marginBottom} key={`item_${i}`}> {item.username}: {item.message}
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
