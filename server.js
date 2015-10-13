/*
* IMPLEMENT THE SERVER
* Implement all of the @TODO comments below
* This is a node js server file. 
* We use the express.io module in order to communicate between the client and server.
* Server side functionality needs to be implemented here.
* As http requests are received you will need to implement different methods in order to correctly
* respond to them. 
*
* SERVER OBJECTIVES: 
* 1) We need to recognize when a client is connecting to the server and serve them the client.html file.
* 2) We need to create the correct functionality when clients connect and disconnect
* 3) We need to route different events that are emitted by the clients and broadcast them accordingly.
* 4) The server must be made aware of other directories and files.
* 5) The server must listen to the port
*/

/* @TODO
* The server requires the module express.io 
* In order to use appmetrics-dash, you will need to require appmetrics-dash and start it.
* Refer to https://www.npmjs.com/package/express.io for express.io usage
* Refer to https://www.npmjs.com/package/appmetrics-dash for appmetrics-dash usage
*/

var express = ; // express.io 
var app = ; // express http io
var appmetrics = ; // appmetrics-dash
var port = 8080;
var leak = process.argv[2];
var userList = {"lobby":[], "room1":[], "room2":[], "room3":[], "room4":[], "room5":[], "room6":[]}
var curUser = {"lobby": "", "room1": "", "room2": "", "room3": "", "room4": "", "room5": "", "room6": ""}

/* @TODO
* Serve the client the client.html file
* app (express http io) has a get function which needs a path ('/') and a call back function 
* with request and response parameters.
* Within the callback function implement a response sendfile with __dirname + '/client.html' as the file
*/
/**********************************************/
// IMPLEMENT HERE

/*
* Add the following code at the beginning of the callback function
if(leak == 'leak')
    {
        // Create a record for request object, and trace it.
        var record = new LogRecord(req);
        // log the record.
        trace(record);
    }
*/




/**********************************************/

// Broadcast all draw clicks.
// app.io.route will send a specified event to this function, in this case 'drawClick' events
app.io.route('drawClick', function(req) {
    /* 
    * req.data is a json of the data that we want to send to the client.
    * The client has already sent us most of the data, but we want to broadbcast
    * back the client id of who sent it and the room it was emitted from. This info
    * is used to determine who and where the data is coming from.
    */

    /* @TODO
    * set the req.data.cid to the id found in the requests io.socket
    */
  	req.data.cid = ;

    /* @TODO
    * set the room to the same room that is found in req.data 
    */

    var room = ;

    /* @TODO 
    * broadcast to the room that we set above. 
    * room is a parameter for the requests io room function
    * broadcast will require two paramaters, the event name and the data. 
    * The event name will be 'draw' and the data will be found in the req variable.
    * for more info on how to broadcast to a specific room refer to https://www.npmjs.com/package/express.io
    */
    /**********************************************/
    // IMPLEMENT HERE




    /**********************************************/
});

// app.io.on will run the callback function everytime the specified event is called, in this case 'connection' events.
app.io.on('connection', function(socket){
  console.log('connection recieved');

// this takes care of disconnect events
  socket.on('disconnect', function() {
    // remove the disconnected socket from the room list
    for (var room in socket['manager']['rooms']){
      if (room === ''){
        var index = userList['lobby'].indexOf(socket.id);
        if (index > -1) {
            userList['lobby'].splice(index, 1);
        }
      }else{
        roomStr = room.slice(1)
        var index = userList[roomStr].indexOf(socket.id);
        if (index > -1) {
            userList[roomStr].splice(index, 1);
        }
      }
    }
  });
});

// When a client joins a room, the callback function will be called.
app.io.route('joinRoom', function(socket) {
    /* @TODO
    * implement socket io's join function using socket.data as the parameter
    */
    /**********************************************/
    // IMPLEMENT HERE
    /**********************************************/
    userList[socket.data].push(socket.io.socket.id)

    /* @TODO
    * emit "clientID" to the clients, with their id as the parameter
    */ 
    /**********************************************/
    // IMPLEMENT HERE
    /**********************************************/

});

// app.use makes the server aware of other directories and files.
app.use('/jscolor', express.static(__dirname + '/jscolor'));
app.use('/icons', express.static(__dirname + '/icons'));
app.use('/lib', express.static(__dirname + '/lib'));

/* @TODO
* specify the port that the server is listening to
* using the http io listen function with port as the parameter
*/
/**********************************************/
// IMPLEMENT HERE
/**********************************************/

// Function to handle the turn by turn functionality
// no need to implement anything here.
for(var room in userList){
    if(room != "lobby"){
        (function theLoop(i, r) {
            setTimeout(function () {
                curUser[r] = userList[r][i];
                // console.log(userList[r]);
                app.io.room(r).broadcast('currentUser', curUser[r])
                i++
                if (i < userList[r].length) {          // If i < length, keep going
                    theLoop(i, r);       // Call the loop again, and pass it the current value of i
                } else {
                    i = 0;
                    theLoop(i, r);
                }
            }, 10000);
        })(0, room);
    }
};

// The following code is for leak debugging
// Create a log record.
function LogRecord(req) {

    this.data = wrap(req);
    this.len = util.inspect(req).length;

    // wrap the request data in a buffer.
    // as we don't know the size, use a huge
    // buffer, which anyways, gets garbage collected
    // when the request ends. :)
    function wrap(data) {
        var buf = new Buffer(1024 * 1024 * 100);
        buf.fill('0');

        // place the request into the buffer.
        buf.write(util.inspect(data));
        var stamp = new Date();

        // store the buffer into the log record.
        this[stamp] = buf;
        // return the data.
        return this[stamp];
    }
}

// Print the log data.
function trace(d) {
    console.log(d.data.slice(0, d.len).toString());
}
