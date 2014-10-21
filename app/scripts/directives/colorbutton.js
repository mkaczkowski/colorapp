'use strict';

/**
 * @ngdoc directive
 * @name colorappApp.directive:colorButton
 * @description
 * # colorButton
 */
angular.module('colorappApp')
        .directive('colorButton', function ($translate) {
            return {
                template: '<div class="{{position}}" style="width: 50%"> <button class="buttoner button-color large regular button-block {{colorClass}}" style="white-space: nowrap;{{extra}}" data-color="{{color}}" data-word="{{word}}" style="margin: 0;width: 100%"><span class="button-label" style="white-space: nowrap">{{word_label}}</span><span ng-transclude></span></button></div>',
                restrict: 'E',
                scope: {
                    position: "@position",
                    word: "@word",
                    word_label: "@word_label",
                    color: "@color",
                    mode: "@mode",
                    extra: "@extra",
                    callback: "&"
                },
                transclude:true,
                controller: function($scope){
                    console.info("colorbutton")
                    $scope.colorClass = $scope.color+"-"+$scope.mode
                    $translate($scope.word.toUpperCase()).then(function (word) {
                        $scope.word_label = word;
                        console.info("label:"+word)
                    });
                },
                replace: true,
                link: function postLink(scope, element, attrs) {
                    if(scope.callback){
                        angular.element(element).click(function() {
                            console.info("clicked!")
                            scope.callback();
                        });
                    }

                }
            };
        })