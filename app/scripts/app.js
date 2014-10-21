'use strict';

angular.module('colorappApp', [ 'ngCordova', 'ui.router', 'ngCookies', 'ngAnimate', 'ngTouch', 'ngRoute', 'ionic', 'firebase', 'pascalprecht.translate', 'colorappApp.config'
]).config(function ($urlRouterProvider, $stateProvider, $translateProvider) {

            $stateProvider.state('home', {
                        url: '/home',
                        templateUrl: 'views/home.html',
                        controller: 'HomeCtrl'
                    }).state('auth', {
                        url: '/auth',
                        templateUrl: 'views/auth.html',
                        controller: 'AuthCtrl'
                    }).state('quiz', {
                        url: '/quiz',
                        templateUrl: 'views/quiz.html',
                        controller: 'QuizCtrl'
                    }).state('versus', {
                        url: '/versus?mode',
                        templateUrl: 'views/versus.html',
                        controller: 'QuizCtrl'
                    }).state('howTo', {
                        url: '/howTo',
                        templateUrl: 'views/howTo.html',
                        controller: 'HowToCtrl'
                    }).state('ranking', {
                        url: '/ranking',
                        templateUrl: 'views/ranking.html',
                        controller: 'RankingCtrl'
                    })

            $urlRouterProvider.otherwise('/home');

            //GLOBALIZATION CONFIG
            $translateProvider.useStaticFilesLoader({ prefix: 'locale/locale-', suffix: '.json' });
            $translateProvider.useLoaderCache(true);
            $translateProvider.useLocalStorage();
//            $translateProvider.preferredLanguage('en');
//            $translateProvider.determinePreferredLanguage();
        }).factory('loadingService', function ($ionicLoading) {
            var loadingService = {};
            loadingService.show = function () {
                $ionicLoading.show({ content: 'Processing...' });
            };
            loadingService.hide = function () {
                $ionicLoading.hide()
            };
            return loadingService;
        }).run(function ($rootScope, $ionicPlatform, $state, timerService, modalService, localeService) {
            console.info("APP init");

            $rootScope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                /*    admobService.init();
                 $timeout(function(){
                 admobService.showHomeAd();
                 },100);*/

                if (!localeService.data.selectedLang) {
                    localeService.getLanguage();
                }
            });

            $rootScope.goBack = function () {
                console.info("goBack:" + $state.current.name);
                if ($state.current.name == 'home') {
                    navigator.app.exitApp();
                } else {
                    timerService.stopTimer();
                    modalService.hideAll();
                    $state.go("home");
                }
            }

            $ionicPlatform.registerBackButtonAction(function () {
                console.info("registerBackButtonAction");
                $rootScope.goBack();
            }, 100);

            $('body').restive({
                breakpoints: ['240', '320', '360', '1000-l', '10000'],
                classes: ['css-240', 'css-320', 'css-360', 'css-1000-l', 'css-10000'],
                turbo_classes: 'is_mobile=mobi,is_phone=phone,is_tablet=tablet,is_landscape=landscape,is_pc=pc',
                force_dip: true
            });

            $rootScope.$on('$translateChangeEnd', function (event, data) {
                localeService.data.selectedLang = data.language;
            });

            /*  onReady: function(){console.info("I'M READY WHEN YOU ARE!");},
             onResize: function(){console.info("I JUST GOT RESIZED!");},
             onRotate: function(){console.info("I JUST GOT ROTATED!");},
             onRotateToP: function(){console.info("I JUST GOT ROTATED TO PORTRAIT!");},
             onRotateToL: function(){console.info("I JUST GOT ROTATED TO LANDSCAPE!");},
             onRetina: function(){console.info("I CANNOT BE MORE CLEAR-EYED!");},
             onPortrait: function(){console.info("I AM TALLER THAN I AM WIDE!");},
             onLandscape: function(){console.info("I AM WIDER THAN I AM TALL!");},
             onPhone: function(){console.info("I AM A PHONE!");},
             onTablet: function(){console.info("I AM A TABLET!");},
             onTV: function(){console.info("I AM A TELEVISION!");},
             onPC: function(){console.info("I AM NOT A PHONE, TABLET, OR TV!");},
             onMobile: function(){console.info("I AM MOBILE!");},
             onNonMobile: function(){console.info("I AM NOT MOBILE!");},*/
        })