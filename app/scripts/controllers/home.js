'use strict';
angular.module('colorappApp')
        .controller('HomeCtrl', function ($scope, modalService, authService, $state) {

            $scope.user = authService.getUser();

            $scope.play = function () {
                if(authService.getUser().id){
                    $scope.goToQuiz()
                }else{
                    $scope.goToAuth()
                }
            };

            $scope.goToAuth = function () {
                $state.go("auth")
            };

            $scope.goToQuiz = function () {
                $scope.removeGlass();
                $state.go("quiz")
            };

            $scope.goToVersus = function () {
                $scope.removeGlass();
                $state.go("versus")
            };

            $scope.goToRanking = function () {
                $state.go("ranking")
            };

            $scope.logout = function () {
                authService.logout(function(){
                    $scope.safeApply(function(){
                        $scope.user = authService.getUser();
                    })
                });
            };
        })