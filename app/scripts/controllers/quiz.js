'use strict';
angular.module('colorappApp')
        .controller('QuizCtrl', function ($scope, $compile, $timeout, timerService, modalService, $state, scoreService) {

            var timeout;
            var lvl = 0;
            var lvls = {0: 915, 2: 10, 3: 8, 4: 7, 5: 5, 7: 4, 10:3, 15: 2} //lvl : secs

            var button_modes = [ "full", "label" ]
            var guess_modes = [ "color", "word" ]
            var colors = [ "blue", "red", "yellow", "orange","green","purple","white","grey", "pink"]
            var isActive = true;
            var isFailed = false;

            var players = $state.current.name == "versus" ? ["quiz1","quiz2"] : ["quiz1"]

            $scope.guess = {};
            $scope.modalTitle = ""
            $scope.scorePublished = false;
            $scope.points = {};

            $scope.guess = {
                color: {},
                word:{},
                guess_mode:{},
                button_mode:{}
            }

            $scope.$on('success',function (event, quizId) {
                console.info("success:"+quizId)
                if(!isActive) return;
                isActive = false;
                lvl++;
                timerService.stopTimer(function (timeLeft) {
                            var points = $scope.points[quizId];
                            $scope.points[quizId] = points + parseInt(timeLeft) + 1;
                        }
                );
                $timeout($scope.nextGuess, 1100);
            })

            $scope.$on('failure',function (event, quizId) {
                console.info("failuree:",quizId)
                if(!isActive) return;
                isActive = false;
                if(players.length > 1){
                    timerService.stopTimer(function (timeLeft) {
                                var points;
                                if(quizId == "quiz1"){
                                    points = $scope.points['quiz2'];
                                    $scope.points['quiz2'] = points + timeLeft + 1;
                                }else{
                                    points = $scope.points['quiz1'];
                                    $scope.points['quiz1'] = points + timeLeft + 1;
                                }
                                $timeout($scope.nextGuess, 500);
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
                if(!isActive){return;}

                $scope.modalTitle = "Time Out!"
                $scope.showFailure()
            }

            $scope.nextGuess = function(_guess_mode, _button_mode){
                clearPanels();
                $timeout(function(){
                    makeElements(_guess_mode, _button_mode);
                },500);
            }

            function clearPanels() {
                $scope.buttons = [];
                $("#quiz1, #quiz2").addClass('zoomOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    console.info("animated")
                    $("#quiz1, #quiz2").removeClass('zoomOut animated').empty();
                });
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
                $scope.safeApply(function () { $scope.guess = undefined });
                var tmpPoints = {};
                angular.forEach(players,function(index){
                    tmpPoints[index] = 0;
                })
                $scope.points = tmpPoints;
                $scope.nextGuess();
            };

            $scope.remach = function () {
                $scope.hideFailure();
                $scope.newGame();
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

            $timeout($scope.newGame, 100);
        })