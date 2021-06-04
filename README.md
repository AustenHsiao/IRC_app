# IRC_app
The purpose of the IRC (internet chat relay) app is to create a custom protocol on which we can build a chat application.
IRC_app uses existing frameworks including socket.io to create a bi-directional connection between server and clients. 
NOTE: The purpose of this app is not to be secure. There are some glaring security flaws, especially in that strings 
passed VIA JSON is not HTML encoded. Anybody could technically perform injection, but this is only deployed locally. 

To run, use node (eg. node server.js). The default port is set to '8080'.
Visiting localhost:8080 will automatically connect to the server, provided that it's running
