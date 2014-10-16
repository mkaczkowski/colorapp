'use strict';

/**
 * @ngdoc directive
 * @name colorappApp.directive:colorButton
 * @description
 * # colorButton
 */

//<colorButtonContainerWrapper guess="{{guess}}">

angular.module('colorappApp')
        .directive('colorButtonContainerWrapper', function ($compile, $timeout) {
            return {
                template:'<div style="{{style}}">'+
                        '<div id="{{quizid}}"> </div>'+
                        '</div>',
                restrict: 'E',
                replace: true,
                scope: {
                    quizid: "@",
                    guess: "=",
                    words: "=",
                    colors : "="
                },
                controller: function($scope) {
                    $scope.buttons = [];
                    $scope.positions = [ "top-left", "top-right", "bottom-left", "bottom-right" ]
                    $scope.points = 0;

                    var isActive = true;

                    $scope.validateAnswer = function(button){
                        if(!isActive){ return; }
                        isActive = false;

                        console.info("guess:",$scope.guess)
                        console.info("answer:",button.attr($scope.guess.guess_mode))

                        var answer =  button.attr($scope.guess.guess_mode)
                        if( $scope.guess[$scope.guess.guess_mode] ==  answer){
                            $scope.success(button) /*SUCCESS*/
                        }else{
                            $scope.failure('Bad answer!', button)   /*FAILURE*/
                        }
                    }

                    $scope.success = function(button){
                        console.info("OK");
                        $scope.points = $scope.points + 1;
                        angular.forEach($scope.buttons,function(btn){
                            if(btn != button){
                                btn.children().addClass("neutral");
                            }else{
                                btn.children().addClass("success");
                                btn.addClass('pulse animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                    console.info("animated")
                                });
                            }
                        })
                        $scope.$emit('success',$scope.quizid);
                    }

                    $scope.failure = function(title, button){
                        console.info("FAILURE!");
                        if(button){
                            angular.forEach($scope.buttons,function(btn){
                                if(btn != button){
                                    btn.children().addClass("neutral");
                                }else{
                                    btn.children().addClass("failure");
                                    btn.addClass('shake animated');
                                }
                            })
                        }
                        $scope.$emit('failure',$scope.quizid);
                    }

                    $scope.$on('newquiz',function () {
                        console.info("newquiz:"+$scope.quizid)
                        var documentElement = angular.element(document.getElementById($scope.quizid));

                        var newElement = angular.element(document.createElement('color-button-container'));
                        var quizContainer = $compile(newElement)( $scope )

                        newElement.addClass('fadeInUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            newElement.removeClass('fadeInUp animated');
                        });

                        console.info(" documentElement.children():", documentElement.children().length);
                        if(documentElement.children().length > 0){
                            documentElement.children().first().addClass('zoomOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                $timeout(function(){
                                    documentElement.empty();
                                    documentElement.append(quizContainer);
                                },200);
                            });
                        }else{
                            documentElement.append(quizContainer);
                        }

                        isActive = true;
                    })
                }
            }
        })