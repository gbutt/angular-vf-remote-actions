(function (global) {
  'use strict';

  global.Visualforce = {
    remoting: {
      Manager: {
        invokeAction: invokeActionWithTimeout
      }
    }
  };

  function buildMockConfig() {
    var mockConfig = global.vfrMockConfig || {
      lotsOfErrors: false,
      latencyinMillis: 500
    };
    return mockConfig;
  }

  function invokeActionWithTimeout() {
    var mockConfig = buildMockConfig();
    var parameters = normalizeArguments(arguments);
    global.setTimeout(function () {
      if (mockConfig.lotsOfErrors && new Date().getTime() % 2 === 1) {
        handleResult(undefined, {
          message: 'lots of errors'
        });
      } else {
        global.vfrMockConfig.invokeActionHandler(parameters);
      }
    }, mockConfig.latencyinMillis);
  }

  function normalizeArguments(invokeActionArguments) {
    var parameters = Array.prototype.slice.apply(invokeActionArguments);
    var action = parameters.shift();
    var actionParts = action.split('.');
    var actionMethod = actionParts.pop();
    var actionController = actionParts.pop();
    var actionNamespace = actionParts.pop();

    var actionParameters = [];
    var next = parameters.shift();
    while (typeof next !== 'function') {
      actionParameters.push(next);
      next = parameters.shift();
    }
    if (actionParameters.length === 0) {
      actionParameters = undefined;
    }
    var callbackFunction = next;
    var actionConfiguration = parameters.shift();
    return {
      action: action,
      namespace: actionNamespace,
      controller: actionController,
      method: actionMethod,
      parameters: actionParameters,
      callbackFunction: callbackFunction,
      configuration: actionConfiguration,
      handleSuccess: function (result) {
        callbackFunction(result, {
          status: 'Success'
        });
      },
      handleFailure: function (message) {
        callbackFunction(undefined, {
          message: message
        });
      },
      handleUndefined: function () {
        callbackFunction(undefined, {
          message: 'No action defined for ' + action
        });
      },
    };
  }

})(window);