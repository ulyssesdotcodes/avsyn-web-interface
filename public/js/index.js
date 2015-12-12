define(function(require) {
  var socket = io('http://localhost:8080'),
      f = require('effing.min'),
      _ = require('underscore-min');

  nx.globalWidgets = false;

  var Vis = function(address) {
    this.address = address;
    this.choices = [];
  };

  Vis.prototype.render = function(el) {
    var _this = this;
    var choiceContainer = document.createElement("div");

    for(var i = 0; i < 10; i++) {
      var button = document.createElement("canvas");
      choiceContainer.appendChild(button);

      var nxButton = nx.transform(button, "button");

      nxButton.label = "Vis " + i;
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

  // Run it!

  var visA = new Vis("/visA");
  visA.render(document.querySelector("#visA"));
});
