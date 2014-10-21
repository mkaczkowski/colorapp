'use strict';
angular.module('colorappApp').factory('storageService', function LocaleService($cordovaPreferences) {

    var getLanguage = function (callback) {
        $cordovaPreferences.get('lang').then(function (name) {
            callback(name)
        })
    };

    var setLanguage = function (lang) {
        $cordovaPreferences.set('lang',lang).then(function () {
            console.log('successfully saved!');
        })
    };

    var getHasRateIt = function (callback) {
        $cordovaPreferences.get('rateIt').then(function (value) {
            console.info("getHasRateIt1:"+value);
            callback(value)
        })
    };

    var setHasRateIt = function (value) {
        $cordovaPreferences.set('rateIt',value,function(){
            console.info("rateIt saved");
        });
    };

    return {
        getHasRateIt: getHasRateIt,
        setHasRateIt: setHasRateIt,
        getLanguage: getLanguage,
        setLanguage: setLanguage
    };
});
