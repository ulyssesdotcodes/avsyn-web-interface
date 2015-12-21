"use strict";

var _ = require('underscore'),
    React = require('react'),
    ReactSlider = require('react-slider'),
    Controls = require('./Controls.js');

var Vis = React.createClass({
  render: function() {

    let path = this.props.path;

    let visualizationListProps = {
      path: this.props.path.concat("choice"),
      actions: this.props.actions,
      data: {
        choices: this.props.data.choices,
        choice: this.props.data.choice
      }
    };

    let effectsListProps = {
      path: this.props.path.concat("effects"),
      actions: this.props.actions,
      data: this.props.data.effects
    };

    let slidersListProps = {
      path: this.props.path.concat("sliders"),
      actions: this.props.actions,
      data: this.props.data.sliders
    };

    return(
        <div className="choiceVisualization">
            <EffectsList {...effectsListProps} />
            <VisualizationList {...visualizationListProps} />
            <SlidersList {...slidersListProps}/>
        </div>
    );
  }
});

var VisualizationList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.choices.map((name, index) => {
      let onSelected = _.partial(this.props.actions.onChange, this.props.path, index);
      var selected = index == this.props.data.choice.value;
      return (
          <VisualizationChoice name={name} key={this.props.path.join('.') + "." + name}
            onSelected={onSelected} selected={selected} />
      )
    });

    return (
        <div className="visualizations">
          {commentNodes}
        </div>
    )
  }
});

var VisualizationChoice = React.createClass({
  render: function() {
    var selectedClass = "toggle" + (this.props.selected ? " selected" : "");

    return(
        <div className={selectedClass} onClick={this.props.onSelected}>
            {this.props.name}
        </div>
    );
  }
})

var SlidersList = React.createClass({
  render: function() {
    let sliderNodes = this.props.data.map((slider, index) => {
      let path = this.props.path.concat(index);
      let onChange = _.partial(this.props.actions.onChange, path);
      let props = _.extend({key:path.join('.')}, slider);
      return (
          <Controls.Slider onChange={onChange} {...props} />
      )
    });

    return (
        <div className="sliders">
          {sliderNodes}
        </div>
    )
  }
})

var EffectsList = React.createClass({
  render: function() {
    let effectNodes = _.values(_.mapObject(this.props.data, (effect, name) => {

      let path = this.props.path.concat(name);
      let onChange = _.partial(this.props.actions.onChange, path);

      let props = _.extend({key:path.join('.')}, effect);

      switch(effect.type) {
      case 0:
        props = _.extend(props, {onChange: onChange});
        return (<Controls.Slider {...props} />);
      case 1:
        let onBoolChange = _.compose(onChange, function(value){ return value ? 1 : 0; });
        props = _.extend(props, {onChange: onBoolChange});
        return (<Controls.Toggle {...props} />);
      }
    }));

    return (
      <div className="effects">
        {effectNodes}
      </div>
    )

  }
});

module.exports = Vis;

