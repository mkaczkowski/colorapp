'use strict';

angular.module('colorappApp')
        .service('scoreService', function ScoreService($q, FBURL, authService) {

            var CURRENT_WEEK_NO = moment(new Date()).format('WW')

            var _self = this;
            var LIMIT = 10;
            var fbRef = new Firebase(FBURL+"/ranking");

            this.getScores = function(week) {
                var $defer = $q.defer();
                fbRef.child(week).endAt().limit(LIMIT).once('value', function (snap) {
                    $defer.resolve(snap.val())
                });
                return $defer.promise;
            }

            this.addScore = function(data, callback) {
                console.info("addScore:",data)

                var user = authService.getUser();

                if(!_self.isNewRecord(data.score)){
                    callback(null)
                    return;
                }

                data = _.extend({
                    userId: user.id,
                    name: user.name,
                    date:moment(new Date()).format('MM/DD/YYYY')
                }, data);


                //ADD SCORE TO TOP
                fbRef.child(CURRENT_WEEK_NO).child(user.id).setWithPriority(data, -data.score, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.info("score added");
                    }
                    if(callback){ callback(err) }
                });

                //UPDATE USER
                user.scores[CURRENT_WEEK_NO] = user.weekScore = data.score;

                if(!_self.isNewOverallRecord(data.score)){
                    delete data.score
                }

                data = _.extend({ scores: user.scores }, data);
                authService.updateUser(user, data)
            }

            this.isNewOverallRecord = function(score) {
                var user = authService.getUser();
                var overallScore = parseInt(user.score);

                if( (!user.id || user.id == "guest") ||
                        (parseInt(score) == 0) ||
                        (overallScore && parseInt(overallScore) >= parseInt(score))){
                    return false;
                }
                return true;
            }

            this.isNewRecord = function(score) {
                var user = authService.getUser();

                if(!user.scores){ user.scores = {}; }
                var weekScore = user.scores[CURRENT_WEEK_NO];

                if(!user.id || user.id == "guest"){
                    return false;
                }

                if(parseInt(score) == 0){
                    return false;
                }

                if (!weekScore) {
                    return true;
                }

                if( parseInt(weekScore) >= parseInt(score)) {
                    return false;
                }

                return true;
            }
        });
