(function (global) {
  'use strict';

  global.vfrMockConfig = {
    lotsOfErrors: false, // see how your app behaves when callouts randomly fail
    latencyinMillis: 500 // see how your app behaves when the network is slow
  };

  // this function lets you handle remote action callouts.
  // args:
  //  action - the fully qualified name of the remote action
  //  namespace - action namespace
  //  controller - action controller
  //  method - action method name
  //  parameters - array of parameters, or undefined
  //  callbackFunction(result, event) - raw callback function. I find it easier to use the handleSuccess, handleFailure functions.
  //  configuration - configuration object, or undefined
  //  handleSuccess(result) - use this function to handle a successful callout.
  //  handleFailure(message) - use this function to handle a failed callout.
  //  handleUndefined() - use this function when you don't recognize the action
  global.vfrMockConfig.invokeActionHandler = function (args) {
    switch (args.method) {
      case 'myAction':
      case 'longRunningAction':
      case 'theRealActionName':
        // return a successful result
        var result = {
          action: args.action,
          parameters: args.parameters,
          configuration: args.configuration
        };
        args.handleSuccess(result);
        break;
      default:
        // unknown remote action
        args.handleUndefined();
    }
  };

})(window);