'use strict';

/**
 * @ngdoc overview
 * @name colorappApp
 * @description
 * # colorappApp
 *
 * Main module of the application.
 */
angular
        .module('colorappApp', [
            'ui.router',
            'ngAnimate',
            'ngTouch',
            'ngRoute',
            'ionic',
            'firebase',
            'colorappApp.config'
        ])
        .config(function ($urlRouterProvider, $stateProvider) {

            $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'views/home.html',
                        controller: 'HomeCtrl'
                    })
                    .state('auth', {
                        url: '/auth',
                        templateUrl: 'views/auth.html',
                        controller: 'AuthCtrl'
                    })
                    .state('quiz', {
                        url: '/quiz',
                        templateUrl: 'views/quiz.html',
                        controller: 'QuizCtrl'
                    })
                    .state('versus', {
                        url: '/versus',
                        templateUrl: 'views/versus.html',
                        controller: 'QuizCtrl'
                    })
                    .state('howTo', {
                        url: '/howTo',
                        templateUrl: 'views/howTo.html',
                        controller: 'HowToCtrl'
                    })
                    .state('ranking', {
                        url: '/ranking',
                        templateUrl: 'views/ranking.html',
                        controller: 'RankingCtrl'
                    })

            $routeProvider.otherwise('/home');
            $urlRouterProvider.otherwise('/home');

        })
        .factory('loadingService', function($ionicLoading) {
            var loadingService = {};
            loadingService.show = function() {$ionicLoading.show({ content: 'Processing...' });};
            loadingService.hide = function(){ $ionicLoading.hide() };
            return loadingService;
        })
        .run(function($rootScope, $ionicPlatform, $state, timerService, modalService) {
            console.info("APP init");
            $rootScope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if(phase == '$apply' || phase == '$digest') {
                    if(fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $ionicPlatform.ready(function() {
                if(window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if(window.StatusBar) {
                    StatusBar.styleDefault();
                }

                /*    admobService.init();
                 $timeout(function(){
                 admobService.showHomeAd();
                 },100);*/
            });

            $rootScope.goBack = function(){
                if ($state.current.name == 'home'){
                    navigator.app.exitApp();
                } else {
                    timerService.stopTimer();
                    modalService.hideAll();
                    $rootScope.addGlass();
                    $state.go("home");
                }
            }

            $rootScope.addGlass = function(){
                angular.element(document.getElementById("navView")).addClass("my-panel-pad")
            }

            $rootScope.removeGlass = function(){
                angular.element(document.getElementById("navView")).removeClass("my-panel-pad")
            }

            $ionicPlatform.registerBackButtonAction(function () {
                $rootScope.goBack();
            }, 100);
        })

