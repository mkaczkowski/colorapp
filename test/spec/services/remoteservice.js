'use strict';

describe('Service: remoteService', function () {

  // load the service's module
  beforeEach(module('colorappApp'));

  // instantiate service
  var remoteService;
  beforeEach(inject(function (_remoteService_) {
    remoteService = _remoteService_;
  }));

  it('should do something', function () {
    expect(!!remoteService).toBe(true);
  });

});
