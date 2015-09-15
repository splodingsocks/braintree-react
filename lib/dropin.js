'use strict';

var dummyClientToken = require('./dummy-client-token');

function getReact() {
  return global.React || require('react');
}

// DropIn is a factory that creates a DropIn React class using an arbitrary
// instance of React. This is to avoid shipping an extra copy of React.
var ReactInstance = getReact();

// Create the DropIn class
var DropIn = ReactInstance.createClass({

  displayName: 'BraintreeDropIn',

  // todo: investigate turning this into clientTokenURL
  // (similar to braintree-angular)
  propTypes: {
    clientToken: ReactInstance.PropTypes.string,
    rootClassName: ReactInstance.PropTypes.string,
    onNonceReceived: ReactInstance.PropTypes.func,
    onReady: ReactInstance.PropTypes.func,
    braintree: ReactInstance.PropTypes.object.isRequired
  },

  getDefaultProps: function () {
    return {
      rootClassName: '__braintree-react__'
    };
  },

  getInitialState: function() {
    return  {
      braintreeInitialized: false,
      integration: null
    };
  },

  componentDidMount: function() {
    this.initializeBraintree(this.props);
  },

  componentWillUnmount: function(test) {
    console.log('will unmount', this.state.integration);
    console.log('cb?', test);
    var integration = this.state.integration;
    if (integration && integration.teardown) {
      console.log('tearing down');
      integration.teardown(function () {
        console.log('torn down');
      });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.initializeBraintree(nextProps);
  },

  initializeBraintree: function(props) {
    props = props || this.props;

    if (props.braintree && !this.state.braintreeInitialized) {
      this.setState({
        braintreeInitialized: true
      }, function() {
        var clientToken;

        if (this.props.clientToken) {
          clientToken = this.props.clientToken;
        } else {
          console.warn('BraintreeDropIn usually needs a clientToken prop. Using dummy client token for now. This will not work in sandbox or production.');
          clientToken = dummyClientToken;
        }

        var self = this;
        props.braintree.setup(
          clientToken,
          'dropin', {
            container: this.getDOMNode(),
            paymentMethodNonceReceived: this.props.onNonceReceived,
            onReady: function (integration) {
              self.setState({
                integration: integration
              });
            }
          }
        );
      });
    }
  },

  render: function() {
    return ReactInstance.DOM.div({
      className: this.props.rootClassName
    });
  }

});

module.exports = DropIn;
