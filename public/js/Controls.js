"use strict";

var _ = require('underscore'),
    React = require('react'),
    ReactSlider = require('react-slider');

var Slider = React.createClass({
  render: function() {
    return (
        <div className="sliderContainer">
            <p className="name">{this.props.name} - {this.props.value}</p>
        <ReactSlider onChange={this.props.onChange} defaultValue={this.props.value} min={this.props.min} max={this.props.max} step={(this.props.max - this.props.min) * 0.01} />
        </div>
    )
  }
});

var Toggle = React.createClass({
  render: function() {
    let selected = this.props.value == 1;
    let className = "toggle" + (selected ? " selected" : "");
    let onChange = _.partial(this.props.onChange, !selected);
    return (
        <div className={className} onClick={onChange}>
            {this.props.name}
        </div>
    )
  }


});

module.exports = { Slider: Slider, Toggle: Toggle };
