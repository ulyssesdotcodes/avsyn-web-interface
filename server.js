var osc = require('osc'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    fs = require('fs');

var OSC_LISTEN = 3333,
    OSC_SEND = 3334;

server.listen(8080);

app.use(express.static('public'));

// OSC Setup

var udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: OSC_LISTEN,
  remoteAddress: "127.0.0.1",
  remotePort: OSC_SEND
});

udpPort.open();
udpPort.send({
  address: "/s_new",
  args: [100]
});

// Socket.io setup

io.on('connection', function(socket) {
  udpPort.on("message", function(message){
    console.log("Received OSC: " + message);
  })

  socket.emit('news', { hello: "world"});
  socket.on('message', function(data) {
    console.log("Sending " + JSON.stringify(data));
    udpPort.send(data);
  });
})
