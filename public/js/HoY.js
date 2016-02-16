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

    return (
        <div className="rpi">
        <ProgList {...progListProps} />
        </div>
    )
  }
})

var ProgList = React.createClass({
  render: function() {
    var progNodes = this.props.data.programs.map((name, index) => {
      let onSelected = _.partial(this.props.actions.onChange, this.props.path, name);
      var selected = name == this.props.data.choice;
      return (
          <VisualizationChoice name={name} key={this.props.path.join('.') + "." + name}
        onSelected={onSelected} selected={selected} />
      )
    });

    return (
        <div className="visualizations">
        {progNodes}
      </div>
    )
  }
});

module.exports = HoY;
