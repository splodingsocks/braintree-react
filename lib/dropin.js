'use strict';

var React = require('react');
var dummyClientToken = require('./dummy-client-token');

var DropIn = React.createClass({

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
      braintreeInitialized: false
    };
  },

  componentDidMount: function() {
    this.initializeBraintree(this.props);
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
        props.braintree.setup(
          clientToken,
          'dropin', {
            container: this.getDOMNode(),
            paymentMethodNonceReceived: this.props.onNonceReceived,
            onReady: this.props.onReady
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
