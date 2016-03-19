"use strict";

var _ = require('underscore'),
    React = require('react'),
    Controls = require('./Controls.js');

var HoY = React.createClass({
  render: function() {
    let path = this.props.path;

    let progListProps = {
      path: path.concat("program"),
      actions: this.props.actions,
      data: {
        programs: this.props.data[path].programs,
        program: this.props.data[path].program
      }
    };

    let cueControlsProps = {
      path: path.concat("cues"),
      actions: this.props.actions,
      data: {
        cues: this.props.data[path].cues
      }
    }

    return (
        <div className="hoy">
        <HoYProgList {...progListProps} />
        <Cues {...cueControlsProps} />
        </div>
    )
  }
})

var HoYProgList = React.createClass({
  render: function() {
    var progNodes = this.props.data.programs.map((name, index) => {
      let onSelected = _.partial(this.props.actions.onChange, this.props.path, name);
      var selected = name == this.props.data.program;
      return (
          <Program name={name} key={this.props.path.join('.') + "." + name}
        onSelected={onSelected} selected={selected} />
      )
    });

    return (
        <div className="programs">
        {progNodes}
      </div>
    )
  }
});

var Program = React.createClass({
  render: function() {
    var selectedClass = "toggle" + (this.props.selected ? " selected" : "");

    return(
        <div className={selectedClass} onClick={this.props.onSelected}>
        {this.props.name}
      </div>
    );
  }
})

var Cues = React.createClass({
  render: function() {
    let cueNodes = _.values(_.mapObject(this.props.data.cues, (cue, name) => {
      let path = this.props.path.concat(name);
      let props = {path: path, key: path.join('.'), data: cue, actions: this.props.actions};

      return(
        <div>
          <h1> {name} </h1>
          <CueControls {...props} />
        </div>
      )
    }));

    return (<div>{cueNodes}</div>)
  }
})

var CueControls = React.createClass({
  render: function() {
    let controlNodes = _.values(_.mapObject(this.props.data, (control, name) => {
      let path = this.props.path.concat([name, "value"]);
      let onChange = _.partial(this.props.actions.onChange, path);
      let props = _.extend({key: path.join('.')}, control);

      switch(control.type) {
      case 'f':
        props = _.extend(props, {onChange: onChange});
        return (<Controls.Slider {...props} />);
      case 'b':
        let onBoolChange = _.compose(onChange, function(value){ return value ? 1 : 0; });
        props = _.extend(props, {onChange: onBoolChange});
        return (<Controls.Toggle {...props} />);
      }
    }));

    return (
      <div>
        {controlNodes}
      </div>
    )
  }
})

module.exports = HoY;
