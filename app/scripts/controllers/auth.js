'use strict';
angular.module('colorappApp')
        .controller('AuthCtrl', function ($scope, modalService, authService, $state, $timeout) {

            $scope.error = {
                show: false,
                text: ""
            };

            $scope.working = false;
            $scope.workingOAuth = false;
            $scope.workingGuest = false;
            $scope.isSigning = false;

            //TEST
            $scope.user = {
                email: "orekk@wp.pl",
                password: "1234"
            };

            $scope.goToQuiz = function () {
                $scope.removeGlass();
                $state.go("quiz")
            };

            $scope.goToHowPlay = function () {
                $state.go("howTo")
            };

            $scope.signUp = function(isValid) {

                if ($scope.working) {
                    return false;
                }

                if (isValid) {
                    console.info('our form is amazing:',$scope.user);
                    $scope.createSimpleUser($scope.user)
                }else{
                    $scope.user.password = "";
                }
            };

            $scope.signIn = function(isValid) {

                if ($scope.working) {
                    return false;
                }

                if (isValid) {
                    console.info('our form is amazing:',$scope.user);
                    $scope.loginSimple($scope.user)
                }else{
                    $scope.user.password = "";
                }
            };

            $scope.createSimpleUser = function (user) {
                $scope.working = true;
                authService.createSimpleUser(user, authSuccessHandler);
            };

            $scope.loginSimple = function (user) {
                $scope.working = true;
                authService.loginSimple(user, authSuccessHandler)
            };

            $scope.loginFacebook = function () {
                $scope.workingOAuth = true;
                authService.loginFacebook(authSuccessHandler)
            };

            $scope.loginAsGuest = function () {
                $scope.workingGuest = true;
                authService.loginAsGuest(authSuccessHandler)
            };

            $scope.showError = function(message) {
                console.error("showError:",message)
                $scope.safeApply(function(){
                    stopWorking()
                    $scope.error.text = message.replace('Error: ','');
                    $scope.error.show = true;
                });

                $timeout(function () {
                    $scope.error.show = false;
                }, 5000);
            };

            function authSuccessHandler(err) {
                console.info("callback")

                if(err){
                    $scope.showError(err.message);
                    return;
                }

                $scope.safeApply(function () {
                    stopWorking()
                    $scope.user = authService.getUser();
                    console.info("user:", $scope.user)
                });
            }

            function stopWorking(){
                $scope.working = $scope.workingOAuth = $scope.workingGuest = false;
            }

        })