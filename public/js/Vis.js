"use strict";

var _ = require('underscore'),
    React = require('react');

var Vis = React.createClass({
  render: function() {
    return(
        <div className={this.props.name}>
          <VisualizationList names={this.props.visualizationNames} onVisualizationSelected={this.props.onVisualizationSelected}/>
        </div>
    );
  }
});

var VisualizationList = React.createClass({
  getInitialState: function() {
    return { selected: 0 };
  },
  onVisualizationSelected: function(index) {
    this.props.onVisualizationSelected(index);
    this.setState({selected: index});
  },
  render: function() {
    var commentNodes = this.props.names.map((name, index) => {
      var selected = index == this.state.selected;
      return (
          <VisualizationChoice name={name} key={index + name} index={index} onSelected={this.onVisualizationSelected}
            selected={selected}/>
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
  handleClick: function(e){
    if(!this.props.selected) {
      this.props.onSelected(this.props.index);
    }
  },
  render: function() {
    var selectedClass = this.props.selected ? "visualization selectedChoice" : "visualization";

    return(
        <div className={selectedClass} onClick={this.handleClick}>
          {this.props.name}
        </div>
    );
  }
})

// Vis.prototype = {
//   render: function(el, names) {
//     this.el = el;
//     el.innerHTML = '';
//     var _this = this;
//     var choiceContainer = document.createElement("div");
//     choiceContainer.setAttribute("class", "choice");
//     this.el.appendChild(choiceContainer);

//     var sliderContainer = document.createElement("div");
//     sliderContainer.setAttribute("class", "sliders");
//     this.el.appendChild(sliderContainer);


//     for(var i = 0; i < names.length; i++) {
//       var button = document.createElement("canvas");
//       choiceContainer.appendChild(button);

//       var nxButton = nx.transform(button, "button");

//       nxButton.label = names[i];
//       nxButton.mode = "toggle";
//       nxButton.address = this.address + "/choice";
//       nxButton.index = i;

//       this.choices[i] = nxButton;

//       nxButton.on('*', _.bind(_this.onChoice, this, nxButton));

//       nxButton.draw();
//     }
//   },

//   onChoice: function(button, data) {
//     if (data.press == 1) {
//       this.socket.emit('message', { address: button.address, args: [button.index] });

//       // Clear the other buttons
//       _.chain(this.choices)
//         .filter(function(b){ return b != button; })
//         .each(function(button) {
//           button.val.press = 0;
//           button.draw();
//         });
//     }
//     else {
//       button.val.press = 1;
//       button.draw();
//     }
//   },

//   setNames: function(message) {
//     _.chain(message.args)
//       .zip(this.choices)
//       .each(function(messageChoice) {
//         messageChoice[1].label = messageChoice[0];
//         messageChoice[1].draw();
//       });
//   },

//   addSlider: function(name, index) {
//     var _this = this;
//     var sliderContainer = this.el.querySelector(".sliders");
//     var slider = document.createElement("canvas");
//     sliderContainer.appendChild(slider);

//     var nxSlider = nx.transform(slider, "slider");

//     this.el.appendChild(slider);

//     nxSlider.label = name;
//     nxSlider.index = index;
//     nxSlider.address = this.address + "/slider/" + index;

//     nxSlider.on('*', _.bind(this.onSlider, this, nxSlider));
//   },

//   onSlider: function(slider, data) {
//     this.socket.emit('message', { address: slider.address, args: [slider.val] });
//   }
// };

module.exports = Vis;
