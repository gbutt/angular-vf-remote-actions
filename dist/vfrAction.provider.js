  angular.module('vfrAction', []).provider('VfrAction', VfrActionProvider);

  function VfrActionProvider() {

    var config = {};
    config.actions = {};

    this.actions = function (actions) {
      config.actions = actions;
    };

    this.defaultNamespace = function (defaultNamespace) {
      config.defaultNamespace = defaultNamespace;
    }

    this.defaultController = function (defaultController) {
      config.defaultController = defaultController;
    }

    this.defaultConfiguration = function (defaultConfiguration) {
      config.defaultConfiguration = defaultConfiguration;
    }

    this.$get = ['$q', '$log', function ($q, $log) {
      return new VfrActionFactory(config).build;

      function VfrAction(action, configuration) {
        this.action = action;
        this.configuration = configuration;

        this.invoke = function () {
          var parameters = Array.prototype.slice.apply(arguments);
          var deferred = $q.defer();
          $log.debug('invoking action: ' + this.action + (parameters.length ? ' with parameters: ' + JSON.stringify(parameters) : '') + (this.configuration ? ' with configuration: ' + JSON.stringify(this.configuration) : ''));
          var args = parameters;
          args.unshift(this.action);
          args.push(function (result, event) {
            $log.debug(result);
            if (event.status) {
              deferred.resolve(result);
            } else {
              deferred.reject(event);
            }
          });
          if (this.configuration) {
            args.push(this.configuration);
          }
          var vfrManager = window.Visualforce.remoting.Manager;
          vfrManager.invokeAction.apply(vfrManager, args);
          return deferred.promise;
        }
      }

      function VfrActionFactory(config) {

        this.build = function (actionName, configurationOpts) {
          var action, configuration;
          var actionConfig = config.actions[actionName] || {};
          if (actionConfig.actionName) {
            action = actionConfig.actionName;
          } else {
            action = actionName;
          }

          // build action
          var nameParts = action.split('.');
          if (!!config.defaultController && nameParts.length < 2) {
            nameParts.unshift(config.defaultController);
          }
          if (!!config.defaultNamespace && nameParts.length < 3) {
            nameParts.unshift(config.defaultNamespace);
          }
          action = nameParts.join('.');
          // build configuration
          if (config.defaultConfiguration || actionConfig.configuration || configurationOpts) {
            configuration = Object.assign({}, config.defaultConfiguration, actionConfig.configuration, configurationOpts);
          }

          return new VfrAction(action, configuration);
        }
      }
    }];
  }