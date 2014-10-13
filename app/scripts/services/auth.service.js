'use strict';

angular.module('colorappApp').service('authService', function ScoreService($q, FBURL) {

    var _self = this;
    var fbRef = new Firebase(FBURL+"/users");

    var currentUser = { };

/*var currentUser = { //TEST
        id : "facebook:10204218045444165",
        name : "Mariusz",
        score :
    };*/

    /*SIMPLE LOGIN*/
    this.createSimpleUser= function(user, callback) {
        fbRef.createUser(user, function(error) {
            if (error === null) {
                console.log("User created successfully");
                _self.loginSimple(user, callback)
            } else {
                console.log("Error creating user:", error);
                callback(error)
            }
        });
    }

    this.loginSimple = function (user, callback) {
        fbRef.authWithPassword(user, function(error, authData) {
                    if (error === null) {

                        fbRef.child(authData.uid).once('value', function (snap) {
                            var storedUser = snap.val();
                            if(storedUser){
                                saveUser(storedUser, callback);
                            }else{
                                saveUser(createSimpleUser(authData, user), callback);
                            }
                        });

                    } else {
                        console.log("Error authenticating user:", error);
                        callback(error)
                    }
                },{
                    remember: "never"
                }
        )
    };

    function createSimpleUser(authData, user){
        var newUser = {
            id: 0,
            name: '',
            full_name:'',
            picture:'images/unknown.png',
            score:''
        }

        newUser.id = authData.uid;
        newUser.name = user.name;
        return newUser;
    }

    /*FACEBOOK LOGIN*/
    this.loginFacebook = function (callback) {
        fbRef.authWithOAuthPopup("facebook", function(error, authData) {
            if (error === null && authData) {
                console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);

                fbRef.child(authData.uid).once('value', function (snap) {
                    var storedUser = snap.val();
                    if(storedUser){
                        saveUser(storedUser, callback);
                    }else{
                        saveUser(createFBUser(authData), callback);
                    }
                });
            } else {
                console.log("Error authenticating user:", error);
                callback(error)
            }
        },{
            remember: "never"
        });
    };

    function createFBUser(authData){
        var newUser = {
            id: 0,
            name: '',
            full_name:'',
            picture:'',
            score:''
        }

        newUser.id = authData.uid;
        if(authData.facebook){
            newUser.full_name = authData.facebook.displayName
            if(authData.facebook.cachedUserProfile){
                newUser.name = authData.facebook.cachedUserProfile.first_name
                newUser.picture = authData.facebook.cachedUserProfile.picture.data.url
            }
        }

        return newUser;
    }

    /*GUEST LOGIN*/
    this.loginAsGuest = function (callback) {
        currentUser = {
            id: "guest",
            name: "Guest",
            picture:'images/guest.png'
        };
        callback()
    };


    this.updateUser = function (user, data, callback) {
        fbRef.child(user.id).update(data, function (err) {
            console.info("user updated:" ,err)
            if (err) { console.error(err); }
            if(callback){callback(err)}
        });
    }

    /*SAVE USER*/
    function saveUser(user, callback) {
        console.info("save user",user)

        if(!user.createDate){
            delete user.password;
            user.createDate = moment(new Date()).format('MM/DD/YYYY HH:mm');
            fbRef.child(user.id).set(user, saveCallback)
        }
        else{
            user.lastLogin = moment(new Date()).format('MM/DD/YYYY HH:mm')
            _self.updateUser(user,{lastLogin : user.lastLogin}, saveCallback);
        }

        function saveCallback(err) {
            console.info("user saved:" ,err)
            if (err) { console.error(err); }
            else { currentUser = user; }
            callback(err)
        }
    }

    /*OTHER*/
    this.logout = function(callback) {
        currentUser = { };
        fbRef.unauth(callback);
    }

    this.getUser = function() {
        return currentUser;
    }
});

/*
 AUTHENTICATION_DISABLED 	The requested authentication provider is disabled for this Firebase.
 EMAIL_TAKEN 	The new user account cannot be created because the specified email address is already in use.
 INVALID_ARGUMENTS 	The specified credentials are malformed or incomplete. Please refer to the error message, error details, and Firebase documentation for the required arguments for authenticating with this provider.
 INVALID_CONFIGURATION 	The requested authentication provider is misconfigured, and the request cannot complete. Please confirm that the provider's client ID and secret are correct in your Firebase Dashboard and the app is properly set up on the provider's website.
 INVALID_CREDENTIALS 	The specified authentication credentials are invalid. This may occur when credentials are malformed or expired.
 INVALID_EMAIL 	The specified email is not a valid email.
 INVALID_ORIGIN 	A security error occurred while processing the authentication request. The web origin for the request is not in your list of approved request origins. To approve this origin, visit the Login & Auth tab in your Firebase dashboard.
 INVALID_PASSWORD 	The specified user account password is incorrect.
 INVALID_PROVIDER 	The requested authentication provider does not exist. Please consult the Firebase authentication documentation for a list of supported providers.
 INVALID_TOKEN 	The specified authentication token is invalid. This can occur when the token is malformed, expired, or the Firebase secret that was used to generate it has been revoked.
 INVALID_USER 	The specified user account does not exist.
 NETWORK_ERROR 	An error occurred while attempting to contact the authentication server.
 PROVIDER_ERROR 	A third-party provider error occurred. Please refer to the error message and error details for more information.
 TRANSPORT_UNAVAILABLE 	The requested login method is not available in the user's browser environment. Popups are not available in Chrome for iOS, iOS Preview Panes, or local, file:// URLs. Redirects are not available in PhoneGap / Cordova, or local, file:// URLs.
 UNKNOWN_ERROR 	An unknown error occurred. Please refer to the error message and error details for more information.
 USER_CANCELLED 	The current authentication request was cancelled by the user.
 USER_DENIED 	The user did not authorize the application. This error can occur when the user has cancelled an OAuth authentication request.*/