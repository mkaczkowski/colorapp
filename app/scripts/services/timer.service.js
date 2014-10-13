'use strict';

/**
 * @ngdoc service
 * @name colorappApp.remoteService
 * @description
 * # remoteService
 * Service in the colorappApp.
 */
angular.module('colorappApp')
  .service('timerService', function TimerService() {

            var timer;

            this.startTimer = function(sec, callback){
                this.stopTimer();
                timer = new radialTimer();
                timer.init("timer", sec, callback);
            };

            this.stopTimer= function(callback){
                if(timer){
                    timer.stop(callback);
                }
            };
        });
