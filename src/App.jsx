import * as React from "react";
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import {
    Box,
    createTheme,
    CssBaseline,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, List, ListItem, ListItemText,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";

import './App.css';

import {PlayArrow, Delete} from "@mui/icons-material";

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
    const [tabValue, setTabValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [running, setRunning] = React.useState(undefined);
    const [device, setDevice] = React.useState('hw:3,0');
    const [recordings, setRecordings] = React.useState([]);

    const [powerOffDialog, setPowerOffDialog] = React.useState(false);

    const handleClickOpen = () => {
        setPowerOffDialog(true);
    };

    const handlePowerOffYes = () => {
        setPowerOffDialog(false);

        powerOff();
    };

    const handlePowerOffNo = () => {
        setPowerOffDialog(false);
    };

    const [deleteFilePath, setDeleteFilePath] = React.useState('');
    const [deleteFileDialog, setDeleteFileDialog] = React.useState(false);

    const handleDeleteFile = () => {
        setDeleteFileDialog(true);
    };

    const handleDeleteFileYes = () => {
        setDeleteFileDialog(false);

        deleteFile(deleteFilePath);
    };

    const handleDeleteFileNo = () => {
        setDeleteFileDialog(false);
    };

    function updateRunning() {
        return fetch('/api/running')
            .then(res => res.json())
            .then(json => {
                setRunning(json.running === true);
                setRecordings(json.recordings);
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

    function powerOff() {
        return fetch('/api/poweroff')
            .then(res => res.text())
            .then(text => {
                console.log('poweroff', text);

                updateRunning();
            });
    }

    function playFile(file) {
        window.location.assign('http://music.local/recordings/' + file);
    }

    function deleteFile(file) {
        return fetch('/api/delete?file=' + file)
            .then(res => res.text())
            .then(text => {
                console.log('delete', text);

                updateRunning();
            });
    }

    React.useEffect(() => {
        updateRunning();

        if (localStorage.device !== undefined) {
            setDevice(localStorage.device);
        }

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

                <Dialog
                    open={powerOffDialog}
                    onClose={handlePowerOffNo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        Power off ?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handlePowerOffNo}>No</Button>
                        <Button onClick={handlePowerOffYes} autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={deleteFileDialog}
                    onClose={handleDeleteFileNo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        Delete {decodeURI(deleteFilePath)} ?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleDeleteFileNo} autoFocus>No</Button>
                        <Button onClick={handleDeleteFileYes}>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChange}
                          aria-label="basic tabs example">
                        <Tab label="Action" {...a11yProps(0)} />
                        <Tab label="Records" {...a11yProps(1)} />
                        <Tab label="Info" {...a11yProps(2)} />
                        <Tab label="Configure" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <div className={"action"}>
                        <Button variant="contained" disabled={running} onClick={() => start()}>Start record</Button>
                        <Button variant="outlined" onClick={() => stop()}>Stop record</Button>
                    </div>
                    <div className={"action"}>
                        <Button variant="contained" color="error" onClick={handleClickOpen}>Power off</Button>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    {(recordings.length > 0 && recordings[0].trim() !== '') && (
                        <List>
                            {recordings.map(file => {
                                return (
                                    <ListItem key={file} secondaryAction={
                                        <div>
                                            <IconButton className={"recordings-button"} edge="end" aria-label="play" onClick={() => {
                                                setDeleteFilePath(file);
                                                handleDeleteFile();
                                            }}>
                                                <Delete />
                                            </IconButton>
                                            <IconButton className={"recordings-button"} edge="end" aria-label="play" onClick={() => playFile(file)}>
                                                <PlayArrow />
                                            </IconButton>
                                        </div>
                                    }>
                                        <ListItemText primary={decodeURI(file)} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    )}
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <div className={"action"}>
                        <Button onClick={() => location.assign('http://' + location.hostname + '/recordings/')} variant="outlined">Recordings list</Button>
                        <Button onClick={() => location.assign('/api/list/process')} variant="outlined">Process list</Button>
                        <Button onClick={() => location.assign('/api/list/card')} variant="outlined">Card list</Button>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={3}>
                    <div className={"configure"}>
                        <TextField id="outlined-basic" fullWidth label="ALSA device" value={device} onChange={event => {
                            setDevice(event.target.value);

                            localStorage.device = event.target.value;
                        }} variant="outlined" />
                    </div>
                </CustomTabPanel>
            </div>
        </ThemeProvider>
    );
}
