import * as React from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Item from '@mui/material/ListItem';
import {Link} from 'react-router-dom'


import './App.css';

// <!--- Recording in progress... --->

export default function App() {
    const [times, setTimes] = React.useState(0);

    return (
        <div>
            <h1 className={"title"}>Xone 23C DJ Set Recorder</h1>
            <div className={"divider"}></div>

            <div className={"status"}>No recording in progress</div>
            <div className={"divider"}></div>

            <div className={"actions"}>
                <Button variant="contained">Start record</Button>
                <Button variant="outlined">Stop record</Button>
                <Button onClick={() => location.assign('http://' + location.hostname + '/recordings/')} variant="outlined">Recordings list</Button>
                <Button onClick={() => location.assign('/api/list')} variant="outlined">Process list</Button>
            </div>
        </div>
    );
}
