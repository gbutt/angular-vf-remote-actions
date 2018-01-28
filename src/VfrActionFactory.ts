import { Injectable } from '@angular/core';

import { VfrActionFactoryConfig, VfrActionConfig, VfrActionCallback, VfrActionCallbackEvent } from './VfrAction.interfaces';

export class VfrAction {
  constructor(private action: string, private configuration: VfrActionConfig) {}

  invoke(...args): Promise<any> {
    let parameters = Array.prototype.slice.apply(arguments);
    return new Promise((resolve, reject) => {
      console.debug('invoking action: ' + this.action + (parameters.length ? ' with parameters: ' + JSON.stringify(parameters) : '') + (this.configuration ? ' with configuration: ' + JSON.stringify(this.configuration) : ''));
      let args = parameters;
      args.unshift(this.action);
      args.push(function (result, event) {
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

@Injectable()
export class VfrActionFactory {
  constructor(private config: VfrActionFactoryConfig) {
    config.actions = config.actions || {};
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