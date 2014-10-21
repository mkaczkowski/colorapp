'use strict';
angular.module('colorappApp').service('dialogsService', function DialogsService($cordovaDialogs,networkService) {


    this.confirm = function(msg,title,callback){
        $cordovaDialogs.confirm(msg, title, ['button 1','button 2'])
                .then(function(buttonIndex) {
                    var btnIndex = buttonIndex; // no button = 0, 'OK' = 1, 'Cancel' = 2
                    if(btnIndex == 1){
                        callback();
                    }
                });
    };


    this.showMarketPopup = function(){
        $cordovaDialogs.confirm("Do you enjoy this quiz?", "Rate this app", ['Rate It!','No thanks'])
                .then(function(buttonIndex) {
                    var btnIndex = buttonIndex; // no button = 0, 'OK' = 1, 'Cancel' = 2
                    console.info("showMarketPopup index:"+btnIndex)
                    if(btnIndex == 1){
                        networkService.showMarket();
                    }
                });
    };

    /*    $cordovaDialogs.alert('message', 'title', 'button name')
     .then(function() {
     // callback success
     });

     $cordovaDialogs.prompt('msg', 'title', ['btn 1','btn 2'], 'default text')
     .then(function(result) {
     var input = result.input1;
     // no button = 0, 'OK' = 1, 'Cancel' = 2
     var btnIndex = buttonIndex;
     });*/
});
