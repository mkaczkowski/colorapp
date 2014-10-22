'use strict';
angular.module('colorappApp')
  .controller('HomeCtrl', function ($scope, $timeout, modalService, authService, $state, localeService, $stateParams, dialogsService, networkService) {

    $scope.selectedLang;

    $scope.$watch( function () { return localeService.data.selectedLang }, function (data) {
      console.info("lang changed1:",localeService)
      $scope.selectedLang = data;
    }, true);

    $scope.langs = [
      {value:"ar", label:"العربية"},
      {value:"zh", label:"中文"},
      {value:"de", label:"Deutsch"},
      {value:"en", label:"English"},
      {value:"es", label:"Español"},
      {value:"fr", label:"Français"},
      {value:"hi", label:"हिन्दी"},
      {value:"it", label:"Italiano"},
      {value:"ja", label:"日本語"},
      {value:"pl", label:"Polski"},
      {value:"pt", label:"Português"},
      {value:"ru", label:"Русский Язык"}
    ]

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

    $scope.chooseLanguage = function () {
      modalService.showLanguageModal($scope)
    };

    $scope.changeLanguage = function (key) {
      localeService.changeLanguage(key);
      modalService.hideLanguageModal()
    };

    $scope.cos = false;
    $scope.selectedItem = {};
    $scope.testAnim = function (x) {
      console.info("selectedItem:",x);
      $('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $('#animationSandbox').attr("class","");
      });
    };

    $scope.showAd = function () {
      networkService.showInter();
    };

    $scope.prepareAd = function () {
      networkService.prepareInter();
    };

    $scope.showPreparedAd = function () {
      networkService.showPreparedInter();
    };

    function init(){
      var popupParam = $stateParams.popup;
      if(popupParam){
        $timeout(function(){
          dialogsService.showMarketPopup()
        },500);
      }
    }

    init();
  })
