var osc = require('osc'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    fs = require('fs'),
    _ = require('highland');

var OSC_LISTEN = 3333,
    OSC_SEND = 3334;

// Web server

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

var onConnection = function(socket) {
  udpPort.on("message", function(message){
    console.log("Received OSC: " + JSON.stringify(message));
    socket.emit('message', message);
    udpPort.send({ address: "/connection", args: [] });
  })

  socket.on('messages', function(data) {
    payload = data.length == 1 ? data[0] : {timeTag: osc.timeTag(0), packets: data};
    udpPort.send(payload);
    console.log("Sending " + JSON.stringify(data));
  });

  udpPort.send({ address: "/connection", args: [] });
}

_('connection', io)
  .each(onConnection);
