'use strict';

/**
 * @ngdoc function
 * @name colorappApp.controller:RankingCtrl
 * @description
 * # RankingCtrl
 * Controller of the colorappApp
 */
angular.module('colorappApp')
        .controller('RankingCtrl', function ($scope, scoreService, authService) {

            var WEEK_NO = 0;

            $scope.weekLabel = {};
            $scope.isCurrentWeek = true;
            $scope.user = authService.getUser();
            $scope.scores = {};

            $scope.addScore = function(score) {
                //TEST
                var data = {score: score};
                scoreService.addScore(data)
            };

            $scope.getScores = function() {
                makeWeekLabel();
                $scope.scores = {};
                scoreService.getScores(WEEK_NO).then(function(values){
                    var tmpArr = [];
                    angular.forEach(values, function (value) {
                        tmpArr.push(_.clone(value))
                    });
                    $scope.scores = tmpArr;
                })
            };

            $scope.prevWeek = function() {
                $scope.isCurrentWeek = false;
                WEEK_NO = WEEK_NO - 1;
                $scope.getScores();
            }

            $scope.nextWeek = function() {
                WEEK_NO = WEEK_NO + 1;
                if(WEEK_NO > parseInt(moment(new Date()).format('WW'))){
                    return;
                }else if(WEEK_NO == parseInt(moment(new Date()).format('WW'))){
                    $scope.isCurrentWeek = true;
                }else{
                    $scope.isCurrentWeek = false;
                }

                $scope.getScores();
            }

            $scope.thisWeek = function() {
                $scope.isCurrentWeek = true;
                WEEK_NO = parseInt(moment(new Date()).format('WW'));
                $scope.getScores();
            }

            function makeWeekLabel() {
                var weekDate = weeksToDate(new Date().getFullYear(), WEEK_NO, 0);
                var weekDate7 = new Date();
                weekDate7.setDate(weekDate.getDate() + 6);
                $scope.safeApply(function () {
                    $scope.weekLabel = moment(weekDate).format("MM/DD") + " - " + moment(weekDate7).format("MM/DD")
                    console.info(" $scope.weekLabel:" + $scope.weekLabel)
                })
            }

            function weeksToDate(y,w,d) {
                var days = 2 + d + (w - 1) * 7 - (new Date(y,0,1)).getDay();
                return new Date(y, 0, days);
            };

            $scope.thisWeek();
        });