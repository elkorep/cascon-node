# Cascon 2015 Demo
-----------
A collaborative whiteboard written in NodeJS

Install
--------
You may install the package using npm install command:

```bash
npm install cascon-node
```
Dependencies
--------
* **express.io** - https://www.npmjs.com/package/express.io
* **appmetrics-dash** - https://www.npmjs.com/package/appmetrics-dash

Within the cascon-node directory, use npm install command in order to install dependencies listed in package.json:
```bash
npm install
```


Server
--------
You will need to implement the server.js file.

Implement all of the @TODO comments 
We use the express.io module in order to communicate between the client and server.
Server side functionality needs to be implemented here.
As http requests are received you will need to implement different methods in order to correctly
respond to them. 
**SERVER OBJECTIVES:** 
* We need to recognize when a client is connecting to the server and serve them the client.html file.
* We need to create the correct functionality when clients connect and disconnect
* We need to route different events that are emitted by the clients and broadcast them accordingly.
* The server must be made aware of other directories and files.
* The server must listen to the specified port

Server Solution
--------
you can find a fully implemented server.js file in server_solution\server.js 
refer to this file if you are completely stuck.

client.html
--------
The client.html file is the front end client side html portion of the demo. it uses different javascript files such as:
* Jquery
* Socket.io
* jscolor/jscolor.js
* lib/room_selector.js
* lib/draw.js

draw.js
--------
This is the file found in the lib directory. 
Draw.js is where any client-side functionality, including the drawing functions are implemented.
Events and data are emitted from here and given to the server to broadcast.
Events that are broadcasted by the server are also received here.

Fake Connections
--------
Fake connections directory contains a seperate server which creates multiple connections and emits many draw events.
This is used to show a spike in memory use.
