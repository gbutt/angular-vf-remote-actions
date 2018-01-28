export class VfrActionFactoryConfig {
  actions?: any;
  defaultNamespace?: string;
  defaultController?: string;
  defaultConfiguration?: VfrActionConfig;
}

export class VfrActionConfig {
  timeout?: Number;
  escape?: boolean;
  buffer?: boolean;
}

export interface VfrActionCallback {
  (result: any, event: VfrActionCallbackEvent): void;
}

export class VfrActionCallbackEvent {
  status: boolean;
  type: string;
  message?: string;
  where?: string;
}