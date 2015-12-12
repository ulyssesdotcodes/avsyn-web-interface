var osc = require('osc'),
    app = require('http').createServer(handler),
    io = require('socket.io')(app),
    fs = require('fs');

var OSC_LISTEN = 3334,
    OSC_SEND = 3333;

app.listen(8080)

function handler(req, res) {
  var indexResponse = function(err, data) {
    if(err) {
      console.log(err);
      res.writeHead(500);
      return res.end("Error loading index.html");
    }

    res.writeHead(200);
    res.end(data);
  };

  fs.readFile(__dirname + "/index.html", indexResponse);
}

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
  socket.on('event', function(data) {
    udpPort.send(data);
  });
})
