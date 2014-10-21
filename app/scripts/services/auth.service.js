'use strict';

angular.module('colorappApp').service('authService', function ScoreService($q, FBURL) {

    var _self = this;
    var fbRef = new Firebase(FBURL + "/users");

    var currentUser = { };

    /*SIMPLE LOGIN*/
    this.createSimpleUser = function (user, callback) {
        fbRef.createUser(user, function (error) {
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
        fbRef.authWithPassword(user, function (error, authData) {
            if (error === null) {
                fbRef.child(authData.uid).once('value', function (snap) {
                    var storedUser = snap.val();
                    if (storedUser) {
                        saveUser(storedUser, callback);
                    } else {
                        saveUser(createSimpleUser(authData, user), callback);
                    }
                });

            } else {
                console.log("Error authenticating user:", error);
                callback(error)
            }
        }, {
            remember: "never"
        })
    };

    function createSimpleUser(authData, user) {
        var newUser = {
            id: 0,
            name: '',
            full_name: '',
            picture: 'images/unknown.png',
            scores: {},
            score: 0
        }

        newUser.id = authData.uid;
        newUser.name = user.name;
        return newUser;
    }

    /*FACEBOOK LOGIN*/
    this.loginFacebook = function (callback) {
        if (window.cordova && facebookConnectPlugin) {
            facebookConnectPlugin.login([], function (status) {
                facebookConnectPlugin.getAccessToken(function (token) {
                    fbRef.authWithOAuthToken("facebook", token, function (error, authData) {
                        if (error) {
                            console.info('Firebase login failed! :',error);
                            callback(error)
                        } else {
                            console.info('Authenticated successfully with payload:', authData);
                            authedUser(null, authData)
                        }
                    }, { remember: "never" });
                }, function (error) {
                    console.info('Could not get access token:'+error);
                    callback(error)
                });
            }, function (error) {
                callback(error)
            });
        } else {
            console.info('authWithOAuthPopup');
            fbRef.authWithOAuthPopup("facebook", function (err, authData) {
                console.info("authWithOAuthPopup:" + err.code + " :: " + err.message);
                if (err) {
                    if (err.code === "TRANSPORT_UNAVAILABLE") {
                        fbRef.authWithOAuthRedirect("facebook", authedUser);
                    } else {
                        callback(err)
                    }
                } else if (authData) {
                    authedUser(null, authData)
                }
            }, {
                remember: "never"
            })
        }

        function authedUser(err, authData) {
            if (err === null && authData) {
                fbRef.child(authData.uid).once('value', function (snap) {
                    var storedUser = snap.val();
                    if (storedUser) {
                        saveUser(storedUser, callback);
                    } else {
                        saveUser(createFBUser(authData), callback);
                    }
                })
            } else {
                callback(err)
            }
        }
    }

    function createFBUser(authData) {
        var newUser = {
            id: 0,
            name: '',
            full_name: '',
            picture: '',
            scores: {},
            score: 0
        }

        newUser.id = authData.uid;
        if (authData.facebook) {
            newUser.full_name = authData.facebook.displayName
            if (authData.facebook.cachedUserProfile) {
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
            picture: 'images/guest.png'
        };
        callback()
    };


    this.updateUser = function (user, data, callback) {
        console.info("update data:",data)
        fbRef.child(user.id).update(data, function (err) {
            console.info("user updated:", err)
            if (err) {
                console.error(err);
            }
            if (callback) {
                callback(err)
            }
        });
    }

    /*SAVE USER*/
    function saveUser(user, callback) {
        console.info("save user", user)

        if (!user.createDate) {
            delete user.password;
            user.createDate = moment(new Date()).format('MM/DD/YYYY HH:mm');
            fbRef.child(user.id).set(user, saveCallback)
        } else {
            user.lastLogin = moment(new Date()).format('MM/DD/YYYY HH:mm')
            _self.updateUser(user, {lastLogin: user.lastLogin}, saveCallback);
        }

        function saveCallback(err) {
            console.info("user saved:", err)
            if (err) {
                console.error(err);
            } else {
                currentUser = user;
                currentUser.weekScore = currentUser.scores ? currentUser.scores[parseInt(moment(new Date()).format('WW'))] : 0;
            }
            callback(err)
        }
    }

    /*OTHER*/
    this.logout = function (callback) {
        if (currentUser.id != "guest") {
            fbRef.unauth(function () {
                if (window.cookies) {
                    window.cookies.clear(function () {
                        console.log("Cookies cleared!");
                    });
                }
            });
        }

        currentUser = { };
        callback();
    }

    this.getUser = function () {
        return currentUser;
    }
});