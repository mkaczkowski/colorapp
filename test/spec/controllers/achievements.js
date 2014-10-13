'use strict';

describe('Controller: AchievementsCtrl', function () {

  // load the controller's module
  beforeEach(module('colorappApp'));

  var AchievementsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AchievementsCtrl = $controller('AchievementsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
