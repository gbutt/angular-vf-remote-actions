(function (root) {
  'use strict';


  describe('VfrActionFactoryProvider', function () {

    // var VfrActionFactoryProvider = require('../src/angular2/VfrActionFactoryProvider').VfrActionFactoryProvider;
    // var VfrActionFactory = VfrActionFactoryProvider.VfrActionFactory;
    // var Q = require('../src/angular2/VfrActionFactoryProvider').Q;

    fit('should be defined', function () {
      expect(VfrActionFactory).toBeDefined();
      expect(typeof VfrActionFactory).toEqual('function');
    })

    describe('forRoot', function () {
      beforeEach(function () {
        this.config = undefined;
        this.vfrActionFactoryProvider = VfrActionFactory.forRoot(this.config);
        this.vfrActionFactory = VfrActionFactory;
        spyOn(root, 'VfrActionFactory').and.callThrough();
      });
      fit('should provide VfrActionFactory', function () {
        expect(this.vfrActionFactoryProvider.provide).toBe(this.vfrActionFactory);
      });
      fit('should use factory with config', function () {
        var factory = this.vfrActionFactoryProvider.useFactory();
        expect(typeof factory).toBe('VfrActionFactory');
      });
    });

    describe('$q', function () {
      beforeEach(function () {
        this.deferred = $q.defer();
      });
      it('should create a deferred promise', function () {
        expect(this.deferred.promise).toBeDefined();
        expect(typeof this.deferred.resolve).toEqual('function');
        expect(typeof this.deferred.reject).toEqual('function');
      });
      it('should resolve', function (done) {
        this.deferred.promise.then(done);
        this.deferred.resolve();
      });
      it('should reject', function (done) {
        this.deferred.promise.catch(done);
        this.deferred.reject();
      });
    });


  });
})(this);