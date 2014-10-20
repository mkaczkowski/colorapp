'use strict';

/**
 * @ngdoc service
 * @name colorappApp.remoteService
 * @description
 * # remoteService
 * Service in the colorappApp.
 */
angular.module('colorappApp')
        .service('modalService', function ModalService($ionicModal) {

            var _self = this;
            var modals = {}

            function openModal(name, scope, newConfig){

                var config = newConfig ? newConfig : {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                };

                var modal = modals[name];
                if(modal && !modal.isShown){
                    modal.show(); return;
                }

                $ionicModal.fromTemplateUrl(name, config).then(function(value) {
                    modals[name] = value;
                    scope.$on('$destroy', function() { modals[name].remove(); });
                    modals[name].show();
                });
            };

            this.showFailureModal = function(scope, data){
                var name = "failure-modal.html"
                openModal(name, _.extend(scope, data))
            }

            this.hideFailureModal = function(){
                var name = "failure-modal.html"
                var modal = modals[name];
                if(modal && modal.isShown()){modals[name].hide()}
            }

            this.showVersusModal = function(scope){
                var name = "versus-modal.html"
                openModal(name,scope)
            }

            this.hideVersusModal = function(){
                var name = "versus-modal.html"
                var modal = modals[name];
                if(modal && modal.isShown()){modals[name].hide()}
            }

            this.showLanguageModal = function(scope){
                var name = "language-modal.html"

                var config = {
                    scope: scope,
                    animation: 'slide-in-up',
                    backdropClickToClose: true,
                    hardwareBackButtonClose: true
                };

                openModal(name,scope, config)
            }

            this.hideLanguageModal = function(){
                var name = "language-modal.html"
                var modal = modals[name];
                if(modal && modal.isShown()){modals[name].hide()}
            }


            this.hideAll = function(){
                _self.hideLanguageModal();
                _self.hideVersusModal();
                _self.hideFailureModal();
            }
        });