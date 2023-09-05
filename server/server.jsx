import path from "path";
import fs from "fs";

import React from "react";
import ReactDOMServer from "react-dom/server";
import express from "express";

import App from "../src/App";

import Api from "./api";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname,'..','dist')));

app.get(['/api', '/api/*'], (req, res) => {
    Api.parse(req, res);
});

app.get("/", (req, res) => {
    fs.readFile(path.resolve("./public/index.html"), "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred");
        }

        return res.send(
            data.replace(
                '<div id="root"></div>',
                `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
            )
        );
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
