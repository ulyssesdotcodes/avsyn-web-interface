var socket = io(),
    _ = require('underscore'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    Vis = require('./Vis.js');

nx.globalWidgets = false;

var listeners = [];
var registerListener = _.partial(
  function(listeners, address, func) {
    listeners.push(_.partial(function(address, func, message){
      if(message.address.startsWith(address)) {
        func(message);
      }
    }, address, func));
  }, listeners);

// Listen for stuff here?
// registerListener(this.address + "/slider", _.bind(function(message) {
//   var index = _.last(message.address.split('/'));
//   if(index == "clear") {
//     this.el.querySelector(".sliders").innerHTML = '';
//   }
//   else {
//     this.addSlider(message.args[0], index);
//   }
// }, _this));


// Set up listeners

socket.on("message", function(message){
  console.log("Received: " + JSON.stringify(message));
  _.each(listeners, function(listener){ listener(message) });
});

// Run it!
document.addEventListener("DOMContentLoaded", function(e){
  var testVisNames = ["One", "Two", "Three", "Four", "Fivadibadadoop"]
  ReactDOM.render(<Vis name="visA" visualizationNames={testVisNames} />, document.getElementById("visA"))
});

registerListener("/connection/choices", function(message){
  var onVisualizationSelected = function(index) {
    socket.emit('message', { address: "/visA/choice", args: [index] });
  };

  ReactDOM.render(
    <Vis name="visA" visualizationNames={message.args} onVisualizationSelected={onVisualizationSelected} />,
    document.getElementById("visA")
  );
});
