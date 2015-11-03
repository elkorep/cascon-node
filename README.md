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


# Cheat Sheet

This section contains a few API calls to help you implement @TODO sections in the server.js


### Require a module

To "import" or require a module in NodeJS you can use the `require` keyword with the name of the module you want to use. This imports `express-io` and assigns it to the variable express:

```javascript
var express = require('express-io');
```

---

### Define a route

You can define a route in express as follows:

```javascript
app.get('/', function(req, res){
  res.send('Cascon NodeJS!');
});
```

The above route responds with "Cascon NodeJS!" when a user visits the homepage.


---
### Serve an HTML file

You can serve a file to a user as follows:

```javascript
app.get('/', function(req, res){
  res.sendfile(__dirname + '/cascon_home.html');
});
```

Once the user visits the homepage ('/'), they will be served the `cascon_home.html` file.

`__dirname` is simply a variable that stores the name of the directory that the currently executing script resides in.

---

### Join a room


```javascript
socket.io.join(ROOM_NAME)
```

---

### Respond to an event triggered by a client

Once a client triggers a *joinCascon* event, we will respond to them with an event labeled *welcomeMsg* with the contents *Welcome to Cascon 2015!*

```javascript
app.io.route('joinCascon', function(socket) {
  socket.io.socket.emit('welcomeMsg', 'Welcome to Cascon 2015!')
});
```


---

### Send data to all members of a room

When *newUser* occurs, broadcast the string *Just added a new user!* with the label *userAdded* to all the clients in *ROOM_NAME*:

```javascript
app.io.route('newUser', function(req) {
  req.io.room(ROOM_NAME).broadcast('userAdded', 'Just added a new user!');
});
```

---

### Sample contents of `data` object in request

```javascript
app.io.route('drawClick', function(req) {
  console.log(req.data);
});
```

The output of the above `console.log` statement would be similar to the following:

```javascript
data:
  { x: 464,
    y: 187,
    type: 'drag',
    color: '#000000',
    size: '1',
    tool: 'pencil',
    cid: 'dpWiHqgtUz5_ji5G29g6',
    room: 'lobby' }
```

---

### Sample data stored in the `socket` parameter in `app.io.on` callback

```javascript
app.io.on('connection', function(socket){
  console.log(socket);
});
```

The output of the above `console.log` statement would be similar to the following:

```javascript
{ id: 'zIio0-sZ0xmWbcd0yk61',
  namespace:
   { manager:
      { server: [Object],
        namespaces: [Object],
        sockets: [Circular],
        _events: [Object],
        settings: [Object],
        handshaken: [Object],
        connected: [Object],
        open: [Object],
        closed: {},
        rooms: [Object],
        roomClients: [Object],
        oldListeners: [Object],
        sequenceNumber: -976597323,
        router: [Object],
        middleware: [],
        route: [Function],
        use: [Function],
        broadcast: [Function],
        room: [Function],
        gc: [Object] },
     name: '',
     sockets: { 'zIio0-sZ0xmWbcd0yk61': [Circular] },
     auth: false,
     flags: { endpoint: '', exceptions: [] },
     _events: { connection: [Object] } },
  manager:
   { server:
      { domain: null,
        _events: [Object],
        _maxListeners: undefined,
        _connections: 7,
        _handle: [Object],
        _usingSlaves: false,
        _slaves: [],
        allowHalfOpen: true,
        pauseOnConnect: false,
        httpAllowHalfOpen: false,
        timeout: 120000,
        _connectionKey: '4:null:8080' },
     namespaces: { '': [Object] },
     sockets:
      { manager: [Circular],
        name: '',
        sockets: [Object],
        auth: false,
        flags: [Object],
        _events: [Object] },
     _events:
      { 'set:transports': [Object],
        'set:store': [Function],
        'set:origins': [Function],
        'set:flash policy port': [Function],
        'set:flash policy server': [Function],
        connection: [Function] },
     settings:
      { origins: '*:*',
        log: false,
        store: [Object],
        logger: [Object],
        static: [Object],
        heartbeats: true,
        resource: '/socket.io',
        transports: [Object],
        authorization: [Function],
        blacklist: [Object],
        'log level': 3,
        'log colors': true,
        'close timeout': 60,
        'heartbeat interval': 25,
        'heartbeat timeout': 60,
        'polling duration': 20,
        'flash policy server': true,
        'flash policy port': 10843,
        'destroy upgrade': true,
        'destroy buffer size': 100000000,
        'browser client': true,
        'browser client cache': true,
        'browser client minification': false,
        'browser client etag': false,
        'browser client expires': 315360000,
        'browser client gzip': false,
        'browser client handler': false,
        'client store expiration': 15,
        'match origin protocol': false },
     handshaken: { 'zIio0-sZ0xmWbcd0yk61': [Object] },
     connected: { 'zIio0-sZ0xmWbcd0yk61': true },
     open: { 'zIio0-sZ0xmWbcd0yk61': true },
     closed: {},
     rooms: { '': [Object] },
     roomClients: { 'zIio0-sZ0xmWbcd0yk61': [Object] },
     oldListeners: [ [Object] ],
     sequenceNumber: -976597323,
     router: { drawClick: [Function], joinRoom: [Function] },
     middleware: [],
     route: [Function],
     use: [Function],
     broadcast: [Function],
     room: [Function],
     gc:
      { _idleTimeout: 10000,
        _idlePrev: [Object],
        _idleNext: [Object],
        _idleStart: 6565027,
        _onTimeout: [Function: wrapper],
        _repeat: true } },
  disconnected: false,
  ackPackets: 0,
  acks: {},
  flags: { endpoint: '', room: '' },
  readable: true,
  store:
   { store: { options: undefined, clients: [Object], manager: [Object] },
     id: 'zIio0-sZ0xmWbcd0yk61',
     data: {} },
  _events: { error: [Function] } }
```

---

### Sample data stored in the `req` parameter in `app.io.route` callback

```javascript
app.io.route('drawClick', function(req) {
  console.log(req);
});
```

The output of the above `console.log` statement would be similar to the following:

```javascript
{ data:
   { x: 404,
     y: 183,
     type: 'dragend',
     color: '#000000',
     size: '1',
     tool: 'pencil',
     cid: 'dpWiHqgtUz5_ji5G29g6',
     room: 'lobby' },
  session: undefined,
  sessionID: undefined,
  sessionStore: undefined,
  socket:
   { id: 't2YypfUJZ4-jIuHX4C9i',
     namespace:
      { manager: [Object],
        name: '',
        sockets: [Object],
        auth: false,
        flags: [Object],
        _events: [Object] },
     manager:
      { server: [Object],
        namespaces: [Object],
        sockets: [Object],
        _events: [Object],
        settings: [Object],
        handshaken: [Object],
        connected: [Object],
        open: [Object],
        closed: {},
        rooms: [Object],
        roomClients: [Object],
        oldListeners: [Object],
        sequenceNumber: -975163550,
        router: [Object],
        middleware: [],
        route: [Function],
        use: [Function],
        broadcast: [Function],
        room: [Function],
        gc: [Object] },
     disconnected: false,
     ackPackets: 0,
     acks: {},
     flags: { endpoint: '', room: '' },
     readable: true,
     store: { store: [Object], id: 't2YypfUJZ4-jIuHX4C9i', data: {} },
     _events:
      { error: [Function],
        disconnect: [Function],
        drawClick: [Function],
        joinRoom: [Function] } },
  headers:
   { host: 'localhost:8080',
     connection: 'keep-alive',
     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
     accept: '*/*',
     referer: 'http://localhost:8080/',
     'accept-encoding': 'gzip, deflate, sdch',
     'accept-language': 'en-US,en;q=0.8' },
  cookies: undefined,
  handshake:
   { headers:
      { host: 'localhost:8080',
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
        accept: '*/*',
        referer: 'http://localhost:8080/',
        'accept-encoding': 'gzip, deflate, sdch',
        'accept-language': 'en-US,en;q=0.8' },
     address: { address: '::1', port: 50670 },
     time: 'Sun Nov 01 2015 20:46:58 GMT-0500 (EST)',
     query: { t: '1446428818764' },
     url: '/socket.io/1/?t=1446428818764',
     xdomain: false,
     secure: undefined,
     session: undefined },
  io:
   { socket:
      { id: 't2YypfUJZ4-jIuHX4C9i',
        namespace: [Object],
        manager: [Object],
        disconnected: false,
        ackPackets: 0,
        acks: {},
        flags: [Object],
        readable: true,
        store: [Object],
        _events: [Object] },
     request: [Circular],
     manager:
      { server: [Object],
        namespaces: [Object],
        sockets: [Object],
        _events: [Object],
        settings: [Object],
        handshaken: [Object],
        connected: [Object],
        open: [Object],
        closed: {},
        rooms: [Object],
        roomClients: [Object],
        oldListeners: [Object],
        sequenceNumber: -975163550,
        router: [Object],
        middleware: [],
        route: [Function],
        use: [Function],
        broadcast: [Function],
        room: [Function],
        gc: [Object] },
     respond: [Function] } }
```

---
