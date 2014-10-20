'use strict';
angular.module('colorappApp').factory('localeService', function LocaleService($cordovaGlobalization, $translate) {
    var data = { selectedLang: "" };

    var getLanguage = function(){
        $cordovaGlobalization.getPreferredLanguage().then(
                function(result) {
                    var tmpArr = result.split("-");
                    var lang = tmpArr ? tmpArr[0] : result;
                    alert('language: ' + lang + '\n');
                    data.selectedLang = lang;
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