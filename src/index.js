import * as React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";

const rootNode = document.getElementById('root');
const root = ReactDOM.hydrateRoot(rootNode, <App />);
