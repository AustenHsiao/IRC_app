const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('sendMsg', (messageObject) => {
        console.log(messageObject);
    });
});



server.listen(port, () => {
    console.log("Listening on port 8080");
});