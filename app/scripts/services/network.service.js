'use strict';
angular.module('colorappApp').factory('networkService', function LocaleService(MARKET_ID, $cordovaNetwork, storageService) {

    var isOnline = function() {
        if(!navigator || !navigator.connection){
            return false;
        }
        return $cordovaNetwork.isOnline();
    };

    var showMarket = function() {
        storageService.getHasRateIt(function(value){
                    console.info("getHasRateIt:"+value);
                    if(!value){
                        storageService.setHasRateIt(true);
                        if(cordova && cordova.plugins && cordova.plugins.market){
                            cordova.plugins.market.open(MARKET_ID);
                        }}
                }
        );
    };


    var admobid = {
        banner: 'ca-app-pub-6869992474017983/9375997553',
        interstitial: 'ca-app-pub-6869992474017983/1657046752'
    }

    var init = function(){
        var defaultOptions = {
            isTesting: true
        };

        if (! window.AdMob ) { alert( 'admob plugin not ready' ); return; }

        AdMob.setOptions( defaultOptions );
        registerAdEvents();
    }

    function registerAdEvents() {
        document.addEventListener('onBannerFailedToReceive', function(data){ alert('error: ' + data.error + ', reason: ' + data.reason); });
        document.addEventListener('onBannerReceive',  function(){console.info("onBannerReceive")});
        document.addEventListener('onBannerPresent',    function(){ console.info("onBannerPresent")});
        document.addEventListener('onBannerLeaveApp',   function(){  console.info("onBannerLeaveApp")});
        document.addEventListener('onBannerDismiss',   function(){  console.info("onBannerDismiss")});
        document.addEventListener('onInterstitialFailedToReceive', function(data){ alert('error: ' + data.error + ', reason: ' + data.reason); });
        document.addEventListener('onInterstitialReceive',  function(){   console.info("onInterstitialReceiveR")});
        document.addEventListener('onInterstitialPresent',  function(){   console.info("onInterstitialReceiveP")});
        document.addEventListener('onInterstitialLeaveApp', function(){    console.info("onInterstitialPresentL")});
        document.addEventListener('onInterstitialDismiss',  function(){   console.info("onInterstitialDismissD")});
    }

    // prepare and aut show
    var showInter = function(){
        AdMob.prepareInterstitial({
            adId: admobid.interstitial,
            autoShow: true
        });
    }

// prepare at beginning of a game level
    var prepareInter = function(){
        AdMob.prepareInterstitial({
            adId: admobid.interstitial,
            autoShow: false
        });
    }

    // check and show it at end of a game level
    var showPreparedInter = function(){
        AdMob.isInterstitialReady(function(isready){
            if(isready) AdMob.showInterstitial();
        });
    }

    return {
        init: init,
        isOnline: isOnline,
        showMarket: showMarket,
        prepareInter: prepareInter,
        showInter: showInter,
        showPreparedInter: showPreparedInter
    };

    /*  Notice for Android Proguard

     To prevent ProGuard from stripping away required classes, add the following lines in the /platform/android/proguard-project.txt file:

     -keep class * extends java.util.ListResourceBundle {
     protected Object[][] getContents();
     }

     -keep public class com.google.android.gms.common.internal.safeparcel.SafeParcelable {
     public static final *** NULL;
     }

     -keepnames @com.google.android.gms.common.annotation.KeepName class *
     -keepclassmembernames class * {
     @com.google.android.gms.common.annotation.KeepName *;
     }

     -keepnames class * implements android.os.Parcelable {
     public static final ** CREATOR;
     }

     -keep public class com.google.cordova.admob.***/


});
