'use strict';

describe('Directive: colorButton', function () {

  // load the directive's module
  beforeEach(module('colorappApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<color-button></color-button>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the colorButton directive');
  }));
});
