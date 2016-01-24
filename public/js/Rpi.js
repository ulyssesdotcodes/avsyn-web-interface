"use strict";

var _ = require('underscore'),
    React = require('react'),
    Controls = require('./Controls.js');

var Rpi = React.createClass({
  render: function() {
    let path = this.props.path;

    let toggleAudioReactive = (value) => this.props.actions.onChange(this.props.path.concat("program"), value ? "audioReactive" : "lit");
    let changeLightLevel = (value) => this.props.actions.onChange(this.props.path.concat("lightLevel"), value);

    return (
        <div className="rpi">
          <Controls.Toggle onChange={ toggleAudioReactive } name="Audio Reactive" />
          <Controls.Slider onChange={ changeLightLevel } name="Light Level" defaultValue={ 0 } min={ 0 } max={ 1 } />
        </div>
    )
  }
})

module.exports = Rpi;
