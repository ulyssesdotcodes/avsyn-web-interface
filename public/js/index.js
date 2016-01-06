"use strict";

var _ = require('underscore'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    Mixer = require('./Mixer.js');

// Set up an object to do all of the osc stuff
class Osc  {
  constructor() {
    this.socket = new WebSocket("ws://127.0.0.1:3000/");
    this.listeners = [];

    this.socket.onopen = (e) => {
      this.socket.send("Connection made!");
    };

    this.socket.onmessage = (socketMessage) => {
      var messageArrayToObject = (arr) => {
        return {
          address: _.first(arr),
          args: _.tail(arr)
        };
      };

      var data = JSON.parse(socketMessage.data);

      if(data[0] == "#bundle") {
        let messages = _.chain(data)
          .rest(2)
          .map(messageArrayToObject)
          .value();

        this.triggerListeners(messages);
      }
      else {
        this.triggerListeners(messageArrayToObject(data));
      }
    };
  }

  triggerListeners(oscMessage) {
    _.each(this.listeners, function(listener){ listener(oscMessage); });
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

  send(bundle) {
    let bundleArray =
      _.chain(bundle)
        .map((message) => {
            return [message.address].concat(message.args);
        })
        .reduce((memo, message) => {
          return memo.concat([message]);
        }, ["#bundle", {timestamp: 0.1}])
        .value();
    this.socket.send(JSON.stringify(bundleArray));
  }
}

class Store {
  constructor(osc) {
    this.props = {
      data: {
        visA: {
          choice: { value: 0 },
          effects: {},
          sliders: {},
        },
        visB: {
          choice: { value: 0 },
          effects: {},
          sliders: {},
        },
        mix: {
          controls: {},
          cueing: false
        },
        choices: [],
      },
      actions:{
        onChange: _.bind(this.onChange, this),
        toggleCueing: _.bind(this.toggleCueing, this),
        playQueue: _.bind(this.playQueue, this)
      }
    };

    this.osc = osc;
    this.queue = [];
  }

  getObject(path) {
    return _.chain(path)
      .initial()
      .reduce(function(memo, path){
        return memo[path];
      }, this.props.data)
      .value();
  }

  onMessage(message) {
    if(Array.isArray(message)) {
      _.each(message, _.bind(this.handleMessage, this));
    }
    else {
      this.handleMessage(message);
    }

    this.render();
  }

  handleMessage(message) {
    let path = message.address.split('/').splice(1);
    let item = _.last(path);
    let object = this.getObject(path);
    if(message.args[0] == 32) {
      object[item] = {
        type: message.args[1],
        name: message.args[2],
        value: message.args[3],
        min: message.args[4],
        max: message.args[5]
      };
    }
    else {
      if(message.args.length == 1) {
        object[item] = message.args[0];
      }
      else {
        object[item] = message.args;
      }
    }
  }

  onChange(path, value) {
    let address = "/" + path.join('/');
    let message = {
      address: address,
      args: [value]
    };

    this.queue.push(message);

    if(!this.props.data.mix.cueing) {
      this.playQueue();
    }

    let object = this.getObject(path);
    let name = _.last(path)
    object[name] = value

    this.render();
  }

  toggleCueing(value) {
    this.props.data.mix.cueing = value;
    this.render();
  }

  playQueue() {
    this.osc.send(this.queue);
    this.queue = [];
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

var osc = new Osc();
var store = new Store(osc);

osc.registerListener(_.bind(store.onMessage, store));
