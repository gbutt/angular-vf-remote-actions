(function (global) {
  'use strict';

  global.vfrMockConfig = {
    lotsOfErrors: false,
    latencyinMillis: 500
  };

  global.vfrMockConfig.invokeActionHandler = function (args) {
    returnActionInfo(args);
  };

  function returnActionInfo(args) {
    args.handleSuccess({
      action: args.action,
      parameters: args.parameters,
      configuration: args.configuration
    });
  }

})(window);