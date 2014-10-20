'use strict';
angular.module('colorappApp').service('storageService', function StorageService($cordovaPreferences) {

   this.getLanguage = function (callback) {
        $cordovaPreferences.get('lang').then(function (name) {
            callback(name)
        })
    };

    this.setLanguage = function (lang) {
        $cordovaPreferences.get('lang',lang).then(function () {
            console.log('successfully saved!');
        })
    };
});