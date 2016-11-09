export class VfrActionFactoryConfig {
  actions?: any;
  defaultNamespace?: string;
  defaultController?: string;
  defaultConfiguration?: VfrActionConfig;
}

export interface VfrActionConfig {
  timeout?: Number;
  escape?: boolean;
  buffer?: boolean;
}

export interface VfrActionCallback {
  (result: any, event: VfrActionCallbackEvent): void;
}

export interface VfrActionCallbackEvent {
  status: boolean;
  type: string;
  message?: string;
  where?: string;
}

export class VfrAction {
  constructor(private action: string, private configuration: VfrActionConfig) {}

  invoke(...args): Promise<any> {
    var parameters = Array.prototype.slice.apply(arguments);
    return new Promise((resolve, reject) => {
      console.debug('invoking action: ' + this.action + (parameters.length ? ' with parameters: ' + JSON.stringify(parameters) : '') + (this.configuration ? ' with configuration: ' + JSON.stringify(this.configuration) : ''));
      var args = parameters;
      args.unshift(this.action);
      args.push(<VfrActionCallback>function (result, event) {
        console.debug(result);
        if (event.status) {
          resolve(result);
        } else {
          reject(event);
        }
      });
      if (this.configuration) {
        args.push(this.configuration);
      }
      var vfrManager = (<any>window).Visualforce.remoting.Manager;
      vfrManager.invokeAction.apply(vfrManager, args);
    });
  }
}

export class VfrActionFactory {
  constructor(private config: VfrActionFactoryConfig = new VfrActionFactoryConfig()) {
    config.actions = config.actions || {};
  }

  static forRoot(config: VfrActionFactoryConfig) {
    return {
      provide: VfrActionFactory,
      useFactory: function () {
        return new VfrActionFactory(config);
      }
    }
  }

  build(actionName: string, configurationOpts?: VfrActionConfig) {
    var action, configuration;
    var actionConfig = this.config.actions[actionName] || {};
    if (actionConfig.actionName) {
      action = actionConfig.actionName;
    } else {
      action = actionName;
    }

    // build action
    var nameParts = action.split('.');
    if (!!this.config.defaultController && nameParts.length < 2) {
      nameParts.unshift(this.config.defaultController);
    }
    if (!!this.config.defaultNamespace && nameParts.length < 3) {
      nameParts.unshift(this.config.defaultNamespace);
    }
    action = nameParts.join('.');
    // build configuration
    if (this.config.defaultConfiguration || actionConfig.configuration || configurationOpts) {
      configuration = Object.assign({}, this.config.defaultConfiguration, actionConfig.configuration, configurationOpts);
    }

    return new VfrAction(action, configuration);
  }
};