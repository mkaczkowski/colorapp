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
        if( cordova && cordova.plugins &&  cordova.plugins.applicationPreferences){
          cordova.plugins.applicationPreferences.get("rateIt", function(value) {
                console.info("getHasRateIt1:"+value);
                callback(value)
            }, function(error) {
                console.info("getHasRateIt error:"+JSON.stringify(error));
                callback(false)
            });
        }
    };

    var setHasRateIt = function (value) {
      if( cordova && cordova.plugins &&  cordova.plugins.applicationPreferences){
             cordova.plugins.applicationPreferences.set("rateIt", value, function(value) {
                console.log("set correctly");
            }, function(error) {
                console.log(JSON.stringify(error));
            });
        }
    };

    return {
        getHasRateIt: getHasRateIt,
        setHasRateIt: setHasRateIt,
        getLanguage: getLanguage,
        setLanguage: setLanguage
    };
});
