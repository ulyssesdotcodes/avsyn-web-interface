define(function(require) {
  var socket = io(),
      f = require('effing.min'),
      _ = require('underscore-min');

  nx.globalWidgets = false;

  var listeners = [];
  var registerListener = function(address, func) {
    listeners.push(_.partial(function(address, func, message){
      if(message.address == address) {
        func(message);
      }
    }, address, func));
  }


  var Vis = function(address) {
    _this = this;
    this.address = address;
    this.choices = [];
  };

  Vis.prototype.render = function(el, names) {
    var _this = this;
    var choiceContainer = document.createElement("div");

    for(var i = 0; i < names.length; i++) {
      var button = document.createElement("canvas");
      choiceContainer.appendChild(button);

      var nxButton = nx.transform(button, "button");

      nxButton.label = names[i];
      nxButton.mode = "toggle";
      nxButton.address = this.address + "/choice";
      nxButton.index = i;

      this.choices[i] = nxButton;

      nxButton.on('*', f(_this, 'onChoice', nxButton));

      nxButton.draw();
    }
  }

  Vis.prototype.onChoice = function(button, data) {
    if (data.press = 1) {
      socket.emit('message', { address: button.address, args: [button.index] });

      // Clear the other buttons
      _.chain(this.choices)
        .filter(function(b){ return b != button; })
        .each(function(button) {
            button.val.press = 0;
            button.draw();
        });
    }
  }

  Vis.prototype.setNames = function(message) {
    _.chain(message.args)
      .zip(this.choices)
      .each(function(messageChoice) {
        messageChoice[1].label = messageChoice[0];
        messageChoice[1].draw();
      });
  }

  // Set up listeners

  socket.on("message", function(message){
    _.each(listeners, function(listener){ listener(message) });
  });

  // Run it!

  var visA = new Vis("/visA");

  registerListener("/connection/choices", function(message){
    visA.render(document.querySelector("#visA"), message.args);
  });
});
