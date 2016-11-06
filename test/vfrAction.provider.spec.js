describe('vfrAction.provider', function () {

  beforeEach(function () {
    angular.mock.module('vfrAction');
  });

  describe('action builder', function () {

    describe('without configuration', function () {
      it('should build action with name and configuration', inject(function (VfrAction) {
        var action = new VfrAction('myAction', {
          a: 1
        });
        expect(action.action).toBe('myAction');
        expect(action.configuration).toEqual({
          a: 1
        });
      }));

      it('should build action without configuration', inject(function (VfrAction) {
        var action = new VfrAction('myAction');
        expect(action.configuration).toBeUndefined();
      }));
    });

    describe('with default configuration', function () {
      beforeEach(function () {
        var self = this;
        self.defaultConfiguration = {
          defaultOpt1: 1,
          defaultOpt2: 2
        };
        angular.mock.module(function (VfrActionProvider) {
          VfrActionProvider.defaultConfiguration(self.defaultConfiguration);
        });
      });

      it('should build action with default configuration', inject(function (VfrAction) {
        var action = new VfrAction('myAction');
        expect(action.action).toBe('myAction');
        expect(action.configuration).toEqual(this.defaultConfiguration);
      }));

      it('should merge configuration with default configuration', inject(function (VfrAction) {
        var action = new VfrAction('myAction', {
          providedOpt: 3
        });
        expect(action.action).toBe('myAction');
        expect(action.configuration).toEqual({
          defaultOpt1: 1,
          defaultOpt2: 2,
          providedOpt: 3
        });
      }));

      it('should override default configuration with provided configuration', inject(function (VfrAction) {
        var action = new VfrAction('myAction', {
          defaultOpt1: 'override'
        });
        expect(action.action).toBe('myAction');
        expect(action.configuration).toEqual({
          defaultOpt1: 'override',
          defaultOpt2: 2,
        });
      }));

    });

    describe('with default controller', function () {
      beforeEach(function () {
        angular.mock.module(function (VfrActionProvider) {
          VfrActionProvider.defaultController('defaultController');
        });
      });

      it('should build action with default controller', inject(function (VfrAction) {
        var action = new VfrAction('myAction');
        expect(action.action).toBe('defaultController.myAction');
      }));

      it('should override default controller with provided controller', inject(function (VfrAction) {
        var action = new VfrAction('anotherController.myAction');
        expect(action.action).toBe('anotherController.myAction');
      }));
    });

    describe('with default namespace', function () {
      beforeEach(function () {
        angular.mock.module(function (VfrActionProvider) {
          VfrActionProvider.defaultController('defaultController');
          VfrActionProvider.defaultNamespace('defaultNs');
        });
      });

      it('should build action with default namespace', inject(function (VfrAction) {
        var action = new VfrAction('myAction');
        expect(action.action).toBe('defaultNs.defaultController.myAction');
      }));

      it('should override default namespace', inject(function (VfrAction) {
        var action = new VfrAction('anotherNs.anotherController.myAction');
        expect(action.action).toBe('anotherNs.anotherController.myAction');
      }));
    });

    describe('with defined action', function () {
      beforeEach(function () {
        var self = this;
        self.definedAction = {
          actionName: 'myAction',
          configuration: {
            definedOpt: 1,
            defaultOpt1: 'overridden'
          }
        }
        angular.mock.module(function (VfrActionProvider) {
          VfrActionProvider.actions({
            definedAction: self.definedAction
          });
          VfrActionProvider.defaultController('defaultController');
          VfrActionProvider.defaultNamespace('defaultNs');
          VfrActionProvider.defaultConfiguration({
            defaultOpt1: 1,
            defaultOpt2: 2
          });
        });
      });

      it('should build defined action', inject(function (VfrAction) {
        var action = new VfrAction('definedAction');
        expect(action.action).toBe('defaultNs.defaultController.myAction');
        expect(action.configuration).toEqual({
          defaultOpt1: 'overridden',
          defaultOpt2: 2,
          definedOpt: 1
        });
      }));
    });

  });

  describe('on invoke', function () {
    beforeEach(function () {
      this.configuration = {
        timeout: 100,
        escape: false
      };
      this.invokeAction = jasmine.createSpy('invokeAction');
      Visualforce = {
        remoting: {
          Manager: {
            invokeAction: this.invokeAction
          }
        }
      };
    });

    it('should call action without arguments', inject(function (VfrAction) {
      var action = new VfrAction('myAction', this.configuration);
      action.invoke();
      expect(this.invokeAction).toHaveBeenCalledWith(
        'myAction', jasmine.any(Function), this.configuration
      );
    }));

    it('should call action without configuration', inject(function (VfrAction) {
      var action = new VfrAction('myAction');
      action.invoke();
      expect(this.invokeAction).toHaveBeenCalledWith(
        'myAction', jasmine.any(Function)
      );
    }));

    it('should call action with arguments', inject(function (VfrAction) {
      var action = new VfrAction('myAction', this.configuration);
      action.invoke('1', '2', '3');
      expect(this.invokeAction).toHaveBeenCalledWith(
        'myAction',
        '1', '2', '3',
        jasmine.any(Function), this.configuration
      );
    }));

    it('should resolve promise', inject(function (VfrAction, $rootScope) {
      var promise = new VfrAction('myAction').invoke();
      var result = {};
      var event = {
        status: 'success'
      };
      this.invokeAction.calls.first().args[1](result, event);

      var resolved = jasmine.createSpy('resolved');
      promise.then(resolved);
      $rootScope.$apply();
      expect(resolved).toHaveBeenCalledWith(result);
    }));

    it('should reject promise', inject(function (VfrAction, $rootScope) {
      var promise = new VfrAction('myAction').invoke();
      var event = {};
      this.invokeAction.calls.first().args[1](undefined, event);

      var resolved = jasmine.createSpy('resolved');
      promise.catch(resolved);
      $rootScope.$apply();
      expect(resolved).toHaveBeenCalledWith(event);
    }));

  })
});