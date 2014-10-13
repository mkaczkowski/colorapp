'use strict';

/**
 * @ngdoc directive
 * @name colorappApp.directive:colorButton
 * @description
 * # colorButton
 */
angular.module('colorappApp')
        .directive('verticalAligned', function () {
            return {
                restrict: 'A',
                transclude: true,
                template: '<div style="display: table; height: 100%; width: 100%">'+
                                    '<div style="display: table-cell; vertical-align: middle">'+
                                        '<div  style="display:table;margin-left: auto; margin-right: auto; text-align: center; width: 100%;" ng-transclude>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>',
                replace: false
            };
        })


