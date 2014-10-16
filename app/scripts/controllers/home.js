'use strict';
angular.module('colorappApp')
        .controller('HomeCtrl', function ($scope, modalService, authService, $state) {

            $scope.user = authService.getUser();
            $scope.isVersus = false;

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
//                $scope.removeGlass();
                $state.go("quiz")
            };

            $scope.goToVersus = function (mode) {
//                $scope.removeGlass();
                $state.go("versus",{mode:mode})
            };

            $scope.goToRanking = function () {
                $state.go("ranking")
            };

            $scope.goToHowPlay = function () {
                $state.go("howTo")
            };

            $scope.logout = function () {
                authService.logout(function(){
                    $scope.safeApply(function(){
                        $scope.user = authService.getUser();
                    })
                });
            };

            $scope.cos = false;
            $scope.selectedItem = {};
            $scope.testAnim = function (x) {
                console.info("selectedItem:",x);
                $('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    $('#animationSandbox').attr("class","");
                });
            };

        })