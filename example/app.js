var app = angular.module('example', ['vfrAction']);

app.config(function (VfrActionProvider) {

  // You can specify a default contoller. All actions will use this controller unless one is specificed.
  VfrActionProvider.defaultController('ApexExampleController');

  // You can predefine some actions and give them unique configurations
  var actions = {};
  actions['longRunningAction'] = {
    actionName: 'longRunningAction',
    configuration: {
      timeout: 120000
    }
  };
  // You can specify a different name and controller for your action if you wish
  actions['anotherControllerAction'] = {
    actionName: 'AnotherApexController.theRealActionName'
  };
  VfrActionProvider.actions(actions);
});

app.controller('ngExampleController', function ($scope, $log, VfrAction) {

  $scope.myAction = function () {
    new VfrAction('myAction')
      .invoke()
      .then(printResult);
  }

  $scope.myActionWithArgs = function (arg1, arg2) {
    new VfrAction('package_namespace.controller.myAction')
      .invoke(arg1, arg2)
      .then(printResult);
  }

  $scope.longRunningAction = function () {
    new VfrAction('longRunningAction')
      .invoke()
      .then(printResult);
  }

  $scope.anotherControllerAction = function () {
    new VfrAction('anotherControllerAction')
      .invoke()
      .then(printResult);
  }

  function printResult(result) {
    $scope.result = result;
  }
});