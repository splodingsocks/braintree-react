'use strict';
var React = require('react');
var braintree = require('braintree-web');
var BraintreeDropIn = require('.').DropIn;

var Outer = React.createClass({

  getInitialState: function () {
    return {
      show: true
    };
  },

  componentWillMount: function () {
    var self = this;
    setTimeout(function () {
      self.setState({
        show: !self.state.show
      });
    }, 5e3);
  },

  render: function () {
    if (this.state.show) {
      return (
        React.DOM.div(null,
          React.createElement(BraintreeDropIn, { braintree: braintree })
        )
      );
    } else {
      return React.DOM.div(null, 'cool');
    }
  }
});

React.render(
  React.createElement(Outer),
  document.getElementById('payment-form')
);
