import socket, time
'''
    The purpose of this project is to create an IRC (internet relay chat) that uses a custom protocol. This project is NOT meant to be a
    stable release (full of security protections or robust features). At a minimum, there will be 1 server with many connecting clients. The 
    general structure is given:

    *Only 1 socket-- this is a bad idea in practice, but will greatly simplify this project
    *A data packet will contain (1) payload, (2) room number, (3) identifying information, (4) timestamp
    
'''


if __name__ == '__main__':
    socket = socket.socket()
    hostname = socket.gethostname()
    socketip = socket.gethostbyname(hostname)
    port = 8080

