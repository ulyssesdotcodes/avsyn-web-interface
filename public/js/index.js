"use strict";

var socket = io(),
    _ = require('underscore'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    Mixer = require('./Mixer.js');

// Set up an object to do all of the osc stuff
class Osc  {
  constructor(socket) {
    this.socket = socket;
    this.listeners = [];

    this.socket.on("message", (message) => {
      _.each(this.listeners, function(listener){ listener(message) });
    });
  }

  registerListener(func) {
    this.listeners.push(func);
  }

  registerAddressListener(address, func) {
    this.listeners.push(_.partial(function(address, func, message){
        if(message.address.match(address)) {
          func(message);
        }
    }, address, func));
  }

  send(message) {
    this.socket.emit('message', message);
  }
}

class Store {
  constructor(osc) {
    this.props = {
      data: {
        visA: {
          choice: { value: 0 },
          effects: {},
          sliders: [],
        },
        visB: {
          choice: { value: 0 },
          effects: {},
          sliders: [],
        },
        mix: {
          controls: {}
        },
        choices: []
      },
      actions:{
        onChange: _.bind(this.onChange, this)
      }
    };

    this.osc = osc;
  }

  onMessage(message) {
    let path = message.address.split('/').splice(1);
    let item = _.last(path);
    let object = this.getObject(path);
    if(item == "clear") {
      object = [];
    }
    else if(message.args[0] == 32) {
      object[item] = {
        name: message.args[1],
        type: message.args[2],
        min: message.args[3],
        max: message.args[4],
        value: message.args[5]
      };
    }
    else {
      object[item] = message.args;
    }

    this.render();
  }

  onChange(path, value) {
    let address = "/" + path.join('/');
    let message = {
      address: address,
      args: [value]
    };

    this.osc.send(message);

    let object = this.getObject(path)[_.last(path)];
    object.value = value;
    this.render();
  }

  getObject(path) {
    return _.chain(path)
      .initial()
      .reduce(function(memo, path){
        return memo[path];
      }, this.props.data)
      .value();
  }

  render() {
    let props = this.props;
    ReactDOM.render(
        <Mixer {...props} />,
      document.getElementById("content")
    );
  }
}

// Run it!

var osc = new Osc(socket);
var store = new Store(osc);

osc.registerListener(_.bind(store.onMessage, store));
