import * as React from "react";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Item from '@mui/material/ListItem';
import {Link} from 'react-router-dom'


import './App.css';

// <!--- Recording in progress... --->

export default function App() {
    const [running, setRunning] = React.useState(undefined);

    const [device, setDevice] = React.useState('hw:3,0');

    function updateRunning() {
        return fetch('/api/running')
            .then(res => res.text())
            .then(text => {
                setRunning(text.includes('true'));
            });
    }

    function start() {
        return fetch('/api/start?device=' + device)
            .then(res => res.text())
            .then(text => {
                console.log('start', text);

                updateRunning();
            });
    }

    function stop() {
        return fetch('/api/stop')
            .then(res => res.text())
            .then(text => {
                console.log('stop', text);

                updateRunning();
            });
    }

    React.useEffect(() => {
        updateRunning();

        const timer = setInterval(() => {
            updateRunning();
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <h1 className={"title"}>Xone 23C DJ Set Recorder</h1>
            <div className={"divider"}></div>

            <div className={"status"}>
                {running === undefined && (
                    <span>Loading recording state...</span>
                )}
                {running === true && (
                    <span>Recording in progress...</span>
                )}
                {running === false && (
                    <span>No recording in progress</span>
                )}
            </div>
            <div className={"divider"}></div>

            <div className={"actions"}>
                <Button variant="contained" onClick={() => start()}>Start record</Button>
                <Button variant="outlined" onClick={() => stop()}>Stop record</Button>
            </div>

            <div className={"divider"}></div>
            <div className={"actions"}>
                <Button onClick={() => location.assign('http://' + location.hostname + '/recordings/')} variant="outlined">Recordings list</Button>
                <Button onClick={() => location.assign('/api/list/process')} variant="outlined">Process list</Button>
                <Button onClick={() => location.assign('/api/list/card')} variant="outlined">Card list</Button>
            </div>
        </div>
    );
}
