import * as React from "react";
import Button from '@mui/material/Button';

import './App.css'

export default function App() {
    const [times, setTimes] = React.useState(0);
    return (
        <div>
            <h1>Music Recorder</h1>
            <div className={"actions"}>
                <Button variant="contained">Start record</Button>
                <Button variant="contained">Stop record</Button>
            </div>
        </div>
    );
}
