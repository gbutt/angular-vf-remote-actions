# angular-vf-remote-actions
An Angular 1.x module that makes it easy to call Salesforce Remote Actions.
This module is only useful if you host your Angular app in a Visualforce page.
For more information on Visualforce Remote Actions read the Salesforce Documentation on [JavaScript Remoting for Apex Controllers](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_js_remoting.htm).

## Usage
1. Install via npm
  ```bash
  npm install angular-vf-remote-actions --save
  ```
  or you can [download manually](dist/vfrAction.provider.js) and include it in your project.

2. Reference in your source code
  ```html
  <!-- local development -->
  <script src="node_modules/angular-vf-remote-actions/dist/vfrAction.provider.js"></script>

  <!-- Visuaforce: assuming you zipped the dist folder into a Static Resource called 'vfrAction' -->
  <script src="{! URLFOR( $Resource.vfrAction, 'dist/vfrAction.provider.js' ) }"></script>
  ```

3. Include vfrAction as a dependency in your application module
  ```javascript
  var app = angular.module('myApp', ['vfrAction']);
  ```

4. Inject VfrAction in your controller
  ```javascript
  app.controller('myCtrl', function(VfrAction) {

    // create a new remote action.
    // This will call the method 'myRemoteAction' on the page controller 'MyApexController'
    new VfrAction('MyApexController.myRemoteAction')

      // pass some parameters to the remote action
      .invoke('arg1', 'arg2')

      // do something with the results
      .then(function(result){
        console.log(result);
      })

      // handle any errors
      .catch(function(event){
        console.error(event);
      });

  });
  ```


## Logging
This module will log all calls and responses to $log.debug. You can disable this with the following configuration:
```javascript
app.config(function($logProvider){
  $logProvider.debugEnabled(false);
});
```


## Hosting in Salesforce
You will need a Visualforce page to host your application, and an Apex Controller for your Remote Actions.
The best way to reference this module from a Visualforce page is to upload it as a Static Resource.

Reference it in your Visualforce page:
```html
<!-- assuming you zipped the dist folder into a Static Resource called 'vfrAction' -->
<script src="{! URLFOR( $Resource.vfrAction, 'dist/vfrAction.provider.js' ) }"></script>
```

Create a Remote Action on your Apex Controller:
```apex
@RemoteAction
global static Account[] myRemoteAction(String name) {
  return [SELECT Id FROM Account WHERE Name = :name];
}
```


## Examples
Example usage can be found at [index.html](index.html).
If you have cloned this repo, you can run the examples page locally with the following command:
```bash
npm start
```


## Configuration
You can set some defaults for your actions by configuring the provider.

```javascript

// configuration
app.config(function(VfrActionProvider){

  // developer orgs only
  VfrActionProvider.defaultNamespace('gbutt');

  // this controller will be prefixed on all your actions, unless you specify another controller
  VfrActionProvider.defaultController('MyApexController');

  // this configuration will get merged in all your actions.
  // You can override it on a per action basis.
  VfrActionProvider.defaultConfiguration({
    timeout: 10000,
    escape: false
  });


  // You can predefine a unique name and configuration for your remote actions.
  var actions = {};
  actions.myAction = {
    actionName: 'myRemoteAction',
    configuration: {
      escape: true,
      buffer: true
    }
  };
  VfrActionProvider.actions(actions);
});

// usage
app.controller('myCtrl', function(VfrAction) {

  // call a predefined action.
  // This will invoke gbutt.MyApexController.myRemoteAction
  // with the configuration {timeout: 10000, escape: true, buffer: true}
  new VfrAction('myAction').invoke();

  // override the default controller
  new VfrAction('AnotherController.anotherAction').invoke();

  // merge and override the default configuration
  new VfrAction('yetAnotherAction', { escape: true }).invoke();
});
```


## Mocking Remote Actions for Local Development
We provide a handy utility for mocking callouts to Remote Actions at [dist/vfrMock.js](dist/vfrMock.js).
See [example/mockedVfrActions.js](example/mockedVfrActions.js) for usage.