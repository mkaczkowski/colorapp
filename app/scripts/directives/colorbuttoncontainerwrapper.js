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
                                    btn.addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                        console.info("animated")
                                    });
                                }
                            })
                        }
                        $scope.$emit('failure',$scope.quizid);
                    }

                    $scope.$on('newquiz',function () {
                        console.info("newquiz:"+$scope.quizid)
                        var documentElement = angular.element(document.getElementById($scope.quizid));
                        documentElement.empty();

                        var newElement = angular.element(document.createElement('color-button-container'));
                        var quizContainer = $compile(newElement)( $scope )

                        newElement.addClass('fadeInUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            console.info("animated2")
                            newElement.removeClass('fadeInUp animated');
                        });

                        documentElement.append(quizContainer);

                        isActive = true;
                    })
                },
                link: function compile(scope, element) {

                }
            }
        })

/*



 function QuizCtrl1($scope, timerService)
 {


 $scope.$on('newquiz', function (event, data) {
 console.info("newquiz1");
 var quizContainer = $compile(angular.element(document.createElement('color-button-container')))( $scope )
 angular.element(document.getElementById("quiz")).append(quizContainer);
 });
 }*/
