import { NgModule, ModuleWithProviders } from '@angular/core';
import { VfrActionFactory } from './VfrActionFactory';
import { VfrActionFactoryConfig } from './VfrAction.interfaces';

@NgModule({
  providers: [
    VfrActionFactory
  ]
})
export class VfrActionModule {
  static forRoot(config: VfrActionFactoryConfig): ModuleWithProviders {
    return {
      ngModule: VfrActionModule,
      providers: [{
        provide: VfrActionFactoryConfig,
        useValue: config
      }]
    }
  }
}