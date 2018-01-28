import { VfrActionConfig, VfrActionCallback } from './VfrAction.interfaces';

export interface InvokeActionHandler{
  (parameters: VfrMockActionArguments): void;
}

export class VfrMockConfig {
  lotsOfErrors?: boolean;
  latencyInMillis?: number;
  invokeActionHandler: InvokeActionHandler;
}

export class VfrMockActionArguments {
  constructor(
    public action: string,
    public namespace: string,
    public controller: string,
    public method: string,
    public parameters: Array<any>,
    public callbackFunction: VfrActionCallback,
    public configuration: VfrActionConfig
  ){}

  handleSuccess(result): void {
    this.callbackFunction(result, {
      status: true,
      type: 'rpc'
    });
  };

  handleFailure(message): void {
    this.callbackFunction(undefined, {
      status: false,
      type: 'exception',
      message: message
    });
  };

  handleUndefined(): void {
    this.callbackFunction(undefined, {
      status: false,
      type: 'exception',
      message: 'No action defined for ' + this.action
    });
  };
}

const defaultMockConfig: VfrMockConfig = {
  lotsOfErrors: false,
  latencyInMillis: 500,
  invokeActionHandler(parameters: VfrMockActionArguments) {
    parameters.handleUndefined();
  }
};

export class VfrMock {
  constructor(private vfrMockConfig: VfrMockConfig) {
    var self = this;
    (<any>window).Visualforce = {
      remoting: {
        Manager: {
          invokeAction(){
            var parameters = self.normalizeArguments(arguments);
            self.invokeActionWithTimeout(parameters);
          }
        }
      }
    };
  }

  static configure(vfrMockConfig: VfrMockConfig): VfrMock {
    vfrMockConfig = Object.assign({}, defaultMockConfig, vfrMockConfig);
    return new VfrMock(vfrMockConfig);
  }

  invokeActionWithTimeout(parameters: VfrMockActionArguments) {
    window.setTimeout(() => {
      if (this.vfrMockConfig.lotsOfErrors && new Date().getTime() % 2 === 1) {
        parameters.handleFailure('lots of errors');
      } else {
        this.vfrMockConfig.invokeActionHandler(parameters);
      }
    }, this.vfrMockConfig.latencyInMillis);
  }

  normalizeArguments(args: IArguments): VfrMockActionArguments {
    let parameters = Array.prototype.slice.apply(args);
    let action = parameters.shift();
    let actionParts = action.split('.');
    let actionMethod = actionParts.pop();
    let actionController = actionParts.pop();
    let actionNamespace = actionParts.pop();

    let actionParameters = [];
    let next = parameters.shift();
    while (typeof next !== 'function') {
      actionParameters.push(next);
      next = parameters.shift();
    }
    if (actionParameters.length === 0) {
      actionParameters = undefined;
    }
    let callbackFunction = next;
    let actionConfiguration = parameters.shift();
    return new VfrMockActionArguments(
      action,
      actionNamespace,
      actionController,
      actionMethod,
      actionParameters,
      callbackFunction,
      actionConfiguration
    );
  };

}