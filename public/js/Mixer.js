"use strict";

var _ = require('underscore'),
    React = require('react'),
    Vis = require('./Vis.js'),
    Controls = require('./Controls');

var Mixer = React.createClass({
  render: function() {
    let createVisProps = (vis) => {
      return {
        path: [vis],
        actions: this.props.actions,
        data: _.extend({choices: this.props.data.choices}, this.props.data[vis])
      };
    };

    var visAProps = createVisProps("visA");
    var visBProps = createVisProps("visB");
    var controlsProps = {
      path: ["mix", "controls"],
      actions: this.props.actions,
      data: this.props.data.mix
    };

    return(
        <div className="mixer">
            <Vis key={"visA"} {...visAProps} />
            <MixerControls key={"controls"} {...controlsProps} />
            <Vis key={"visB"} {...visBProps} />
        </div>
    );
  }
});

var MixerControls = React.createClass({
  render: function() {
    let controlNodes = _.values(_.mapObject(this.props.data.controls, (control, name) => {
      let path = this.props.path.concat(name);
      let onChange = _.partial(this.props.actions.onChange, path);
      let props = _.extend({key:path.join('.')}, control);

      switch(control.type) {
      case 0:
        props = _.extend(props, {onChange: onChange});
        return (<Controls.Slider {...props} />);
      case 1:
        let onBoolChange = _.compose(onChange, function(value){ return value ? 1 : 0; });
        props = _.extend(props, {onChange: onBoolChange});
        return (<Controls.Toggle {...props} />);
      }
    }));
    return(
        <div className="controls">
            {controlNodes}
        </div>
    )
  }
})

module.exports = Mixer;
