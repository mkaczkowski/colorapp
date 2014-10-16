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

                if(!_self.isNewRecord(data.score)){
                    callback(null)
                    return;
                }

                var user = authService.getUser();
                user.score = data.score;
                authService.updateUser(user, data)

                data = _.extend({
                    userId: user.id,
                    name: user.name,
                    date:moment(new Date()).format('MM/DD/YYYY')
                }, data);

                fbRef.child(CURRENT_WEEK_NO).child(user.id).setWithPriority(data, -data.score, function (err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.info("score added");
                    }
                    if(callback){ callback(err) }

                });
            }

            this.isNewRecord = function(score) {
                var user = authService.getUser();
                console.info("user.id:"+user.id)
                console.info("parseInt(score):"+parseInt(score))
                console.info("parseInt(user.score):"+parseInt(user.score))

                if( (!user.id || user.id == "guest") ||
                    (parseInt(score) == 0) ||
                    (user.score && parseInt(user.score) >= parseInt(score))){
                        return false;
                }
                return true;
            }
        });
