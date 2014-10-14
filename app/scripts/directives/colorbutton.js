'use strict';

/**
 * @ngdoc directive
 * @name colorappApp.directive:colorButton
 * @description
 * # colorButton
 */
angular.module('colorappApp')
        .directive('colorButton', function () {
            return {
                template: '<div class="{{position}}" style="width: 50%"> <button class="buttoner large regular button-block {{colorClass}}" style="{{extra}}" data-color="{{color}}" data-word="{{word}}" style="margin: 0;width: 100%">{{word}}<span ng-transclude></span></button></div>',
                restrict: 'E',
                scope: {
                    position: "@position",
                    word: "@word",
                    color: "@color",
                    mode: "@mode",
                    extra: "@extra",
                    callback: "&"
                },
                transclude:true,
                controller: function($scope){
                    $scope.colorClass = $scope.color+"-"+$scope.mode
                },
                replace: true,
                link: function postLink(scope, element, attrs) {
                    if(scope.callback){
                        angular.element(element).click(function() {
                            console.info("clicked!")
                            scope.callback();
                        });
                    }

//                    element.text('this is the colorButton directive');
                }
            };
        })