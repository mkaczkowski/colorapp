'use strict';
angular.module('colorappApp').factory('localeService', function LocaleService($cordovaGlobalization, $translate) {
    var data = { selectedLang: null };
    var DEFAULT_LANG = "en";

    var getLanguage = function(){
        $cordovaGlobalization.getPreferredLanguage().then(
                function(result) {
                    var tmpArr = result.value.split("-");
                    var lang = tmpArr ? tmpArr[0] : result.value;
                    data.selectedLang = lang;
                },
                function(error) {
                    data.selectedLang = DEFAULT_LANG;
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