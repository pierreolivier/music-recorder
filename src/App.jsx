import * as React from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import {Box, createTheme, CssBaseline, Tab, Tabs, TextField, ThemeProvider, Typography} from "@mui/material";

import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});
// <!--- Recording in progress... --->

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            className={'simple-panel'}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function App() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
        setRunning(true);

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
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
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

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}
                          aria-label="basic tabs example">
                        <Tab label="Action" {...a11yProps(0)} />
                        <Tab label="Info" {...a11yProps(1)} />
                        <Tab label="Configure" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <div className={"action"}>
                        <Button variant="contained" disabled={running} onClick={() => start()}>Start record</Button>
                        <Button variant="outlined" onClick={() => stop()}>Stop record</Button>
                    </div>
                    <div className={"action"}>
                        <Button variant="contained" color="error">Power off</Button>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div className={"action"}>
                        <Button onClick={() => location.assign('http://' + location.hostname + '/recordings/')} variant="outlined">Recordings list</Button>
                        <Button onClick={() => location.assign('/api/list/process')} variant="outlined">Process list</Button>
                        <Button onClick={() => location.assign('/api/list/card')} variant="outlined">Card list</Button>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <div className={"configure"}>
                        <TextField id="outlined-basic" fullWidth label="ALSA device" value={device} onChange={event => {
                            setDevice(event.target.value);
                        }} variant="outlined" />
                    </div>
                </CustomTabPanel>
            </div>
        </ThemeProvider>
    );
}
