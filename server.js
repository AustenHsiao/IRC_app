const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = process.env.PORT || 8080;


var users = {}; //store usernames
var rooms = new Set(); //store roomnames

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('somebody connected');

    socket.on('sendMsg', (messageObject) => {
        io.sockets.emit('chat', messageObject);
    });

    socket.on('urChange', (data) => {
        var flag = 1;
        var name = data.uname.toLowerCase();
        if(users[name] !== undefined){ // key exists
            socket.emit('urResponse', 0);
        }else{
            users[name] = name
            socket.emit('urResponse', 1);
            flag = 0;
        }

        if(flag === 0){
            var room = data.rname.toLowerCase();
            rooms.add(room);
            console.log(`${data.oldName} changed name to ${data.uname} and moved from ${data.oldRoom} to ${room}`);

        }
        

    });
});



server.listen(port, () => {
    console.log("Listening on port 8080");
});
