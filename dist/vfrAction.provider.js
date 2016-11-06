(function () {
  'use strict';

  angular.module('vfrAction', []).provider('VfrAction', VfrActionProvider);

  function VfrActionProvider() {

    var provider = this;
    provider.definedActions = {};

    this.actions = function (definedActions) {
      provider.definedActions = definedActions;
    };

    this.defaultNamespace = function (namespace) {
      provider.namespace = namespace;
    }

    this.defaultController = function (controller) {
      provider.controller = controller;
    }

    this.defaultConfiguration = function (configuration) {
      provider.configuration = configuration;
    }

    this.$get = ['$q', '$log', function ($q, $log) {

      function VfrAction(actionName, configuration) {
        var self = this;
        this.buildActionConfig(actionName, configuration);

        this.invoke = function () {
          var deferred = $q.defer();
          var parameters = Array.prototype.slice.apply(arguments);
          $log.debug('invoking action: ' + self.action + (parameters.length ? ' with parameters: ' + JSON.stringify(parameters) : '') + (self.configuration ? ' with configuration: ' + JSON.stringify(self.configuration) : ''));
          var args = parameters;
          args.unshift(self.action);
          args.push(function (result, event) {
            $log.debug(result);
            if (event.status) {
              deferred.resolve(result);
            } else {
              deferred.reject(event);
            }
          });
          if (self.configuration) {
            args.push(self.configuration);
          }
          var vfrManager = Visualforce.remoting.Manager;
          vfrManager.invokeAction.apply(vfrManager, args);
          return deferred.promise;
        };
      }

      VfrAction.prototype.buildActionConfig = function (actionName, configurationOpts) {
        var action, configuration;
        var actionConfig = provider.definedActions[actionName] || {};
        if (actionConfig.actionName) {
          action = actionConfig.actionName;
        } else {
          action = actionName;
        }

        // build action
        var nameParts = action.split('.');
        if (!!provider.controller && nameParts.length < 2) {
          nameParts.unshift(provider.controller);
        }
        if (!!provider.namespace && nameParts.length < 3) {
          nameParts.unshift(provider.namespace);
        }
        action = nameParts.join('.');

        // build configuration
        if (provider.configuration || actionConfig.configuration || configurationOpts) {
          configuration = angular.extend({}, provider.configuration, actionConfig.configuration, configurationOpts);
        }

        this.action = action;
        this.configuration = configuration;
      };

      return VfrAction;
    }];
  }
})();