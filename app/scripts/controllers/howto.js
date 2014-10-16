'use strict';
angular.module('colorappApp')
        .controller('HowToCtrl', function ($scope, authService, $state) {

            $scope.answer1 = {};
            $scope.answer2 = {};

            $scope.okAnswer1 = function() {
                $scope.safeApply(function () {
                    $scope.answer1 = true;
                });
            };

            $scope.badAnswer1 = function() {
                $scope.safeApply(function () {
                    $scope.answer1 = false;
                });
            };

            $scope.okAnswer2 = function() {
                $scope.safeApply(function () {
                    $scope.answer2 = true;
                });

            };

            $scope.badAnswer2 = function() {
                $scope.safeApply(function () {
                    $scope.answer2 = false;
                });
            };

            $scope.goToplay = function () {
                if(authService.getUser().id){
                    $scope.goToQuiz()
                }else{
                    $scope.goToAuth()
                }
            };

            $scope.goToQuiz = function () {
//                $scope.removeGlass();
                $state.go("quiz")
            };


            $scope.goToAuth = function () {
                $state.go("auth")
            };
        })