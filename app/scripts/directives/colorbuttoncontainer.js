'use strict';

/**
 * @ngdoc directive
 * @name colorappApp.directive:colorButton
 * @description
 * # colorButton
 */
angular.module('colorappApp')
        .directive('colorButtonContainer', function ($compile) {
            return {
                template: '<div class="tableWrapper" style="width: 100%"></div>',
                restrict: 'E',
                replace: true,
                link: function compile(scope, element) {
                    angular.forEach(scope.positions,function(position, index){

                        var word = scope.words[index]
                        var colorClass = scope.colors[index]
                        var mode = scope.guess.button_mode;
                        var button = $compile('<color-button position="'+position+'" word="'+word+'" color="'+colorClass+'" mode="'+mode+'"></color-button>')(scope);

                        button.bind( "click", function() {
                           scope.validateAnswer(button);
                        });

                        scope.buttons.push(button)
                        element.append(button);
                    })
                }
            }
        })