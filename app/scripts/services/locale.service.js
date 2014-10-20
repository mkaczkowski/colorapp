'use strict';
angular.module('colorappApp').factory('localeService', function LocaleService($cordovaGlobalization, $translate) {
    var data = { selectedLang: "en" };

    var getLanguage = function(){
        $cordovaGlobalization.getPreferredLanguage().then(
                function(result) {
                    alert('language: ' + result.value + '\n');
                    data.selectedLang = result;
                },
                function(error) {
                    console.error("getPreferredLanguage error:"+error);
                });
    };

    var changeLanguage = function(lang){
        console.info("change lang:"+lang)
        data.selectedLang = lang;
        $translate.use(lang);
    };

    return {
        data: data,
        getLanguage: getLanguage,
        changeLanguage: changeLanguage
    };
});