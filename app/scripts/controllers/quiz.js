'use strict';
angular.module('colorappApp')
        .controller('QuizCtrl', function ($scope, $compile, $timeout, $stateParams, timerService, modalService, $state, scoreService) {

            var timeout;
            var lvl = 0;
            var lvls = {0: 15, 2: 10, 3: 8, 4: 7, 5: 5, 7: 4, 10:3, 15: 2} //lvl : secs

            var button_modes = [ "full", "label" ]
            var guess_modes = [ "color", "word" ]
            var colors = [ "blue", "red", "yellow", "orange","green","purple","white","grey", "pink"]
            var isActive = true;
            var isFailed = false;

            var players = $state.current.name == "versus" ? ["quiz1","quiz2"] : ["quiz1"]
            var mode = parseInt($stateParams.mode);

            $scope.guess = undefined;
            $scope.modalTitle = ""
            $scope.scorePublished = false;
            $scope.points = {};

            $scope.$on('success',function (event, quizId) {
                console.info("success:"+quizId)
                if(!isActive) return;
                isActive = false;
                lvl++;

                timerService.stopTimer(function (timeLeft) {
                            var points = $scope.points[quizId];
                            $scope.points[quizId] = points + ((mode == 2) ? 1 : (timeLeft + 1))
                        }
                );

                if(players.length > 1){
                    verifyVersusScore();
                }else{
                    $timeout($scope.nextGuess, 500);
                }
            })

            function verifyVersusScore() {
                if (((mode == 1) && $scope.points['quiz2'] < 100 && $scope.points['quiz1'] < 100) || ((mode == 2) && $scope.points['quiz2'] < 10 && $scope.points['quiz1'] < 10)) {
                    $timeout($scope.nextGuess, 600);
                } else {
                    $scope.modalTitle = "Game Over!"
                    $scope.showFailure()
                }
            }

            $scope.$on('failure',function (event, quizId) {
                console.info("failuree:",mode)
                if(!isActive) return;
                isActive = false;
                if(players.length > 1){
                    timerService.stopTimer(function (timeLeft) {
                                var points;
                                if(quizId == "quiz1"){
                                    points = $scope.points['quiz2'];
                                    $scope.points['quiz2'] = points + ((mode == 2) ? 1 : (timeLeft + 1));
                                }else{
                                    points = $scope.points['quiz1'];
                                    $scope.points['quiz1'] = points + ((mode == 2) ? 1 :  (timeLeft + 1));
                                }
                                verifyVersusScore();
                            }
                    );
                }else{
                    timerService.stopTimer();
                    $timeout(function(){
                        $scope.modalTitle = "Wrong Answer!"
                        $scope.showFailure()
                    }, 500);
                }
            })

            $scope.timeIsOut = function(){
                console.info("timeout players.length:"+players.length);
                if(!isActive){return;}
                isActive = false;

                if(players.length > 1){
                    $scope.nextGuess();
                }else{
                    $scope.modalTitle = "Time Out!"
                    $scope.showFailure()
                }

            }

            $scope.nextGuess = function(_guess_mode, _button_mode){
                $scope.guess = undefined;
                $scope.buttons = [];
                makeElements(_guess_mode, _button_mode);
            }

            function makeElements(_guess_mode, _button_mode){
                //            MODE
                var guess_mode = _guess_mode ? _guess_mode :_.sample(guess_modes);
                var button_mode =  _button_mode ? _button_mode :_.sample(button_modes);
                timeout = lvls[lvl] ? lvls[lvl]: timeout;
                console.info("lvl:"+lvl+" :: "+timeout);

//            COLORS
                var tmpColors  = _.clone(colors);
                $scope.colors  = _.sample(tmpColors, 4);
                var guessColor = _.sample($scope.colors);

//            WORDS
                $scope.words = _.shuffle($scope.colors);
                var guessWord = guessColor;

//            GUESS
                $scope.guess = {
                    color:guessColor,
                    word:guessWord,
                    guess_mode:guess_mode,
                    button_mode:button_mode
                }

                //TODO REFACTOR
                $timeout(function(){ $scope.$broadcast('newquiz',{}); }, 100);
//             INIT
                timerService.startTimer(timeout, $scope.timeIsOut);
                isActive = true;
            }

            $scope.newGame = function () {
                lvl = 0;
                var tmpPoints = {};
                angular.forEach(players,function(index){
                    tmpPoints[index] = 0;
                })
                $scope.points = tmpPoints;
                $scope.nextGuess();
            };

            $scope.remach = function () {
                $scope.hideFailure();
                $scope.guess = undefined;
                $timeout($scope.newGame, 500);
            };

            $scope.showFailure = function() {

                if(isFailed){return;}

                isFailed = true;
                if(players.length > 1){
                    showFailureVersus();
                }else{
                    showFailureSingle();
                }

                function showFailureSingle() {
                    $scope.scorePublished = false;
                    var data = {isNewRecord: scoreService.isNewRecord($scope.points['quiz1'])}
                    modalService.showFailureModal($scope,data)
                };

                function showFailureVersus() {
                    modalService.showVersusModal($scope)
                };
            };

            $scope.hideFailure = function() {
                isFailed = false;
                if(players.length > 1){
                    modalService.hideVersusModal()
                }else{
                    modalService.hideFailureModal()
                }
            };

            $scope.publishScore = function() {
                var data = {score: $scope.points['quiz1']}
                scoreService.addScore(data, function(err){
                    console.info("add Score11:"+err);
                    $scope.safeApply(function () {
                        $scope.scorePublished = true;
                    });
                });
            };

            $timeout($scope.newGame, 500);
        })