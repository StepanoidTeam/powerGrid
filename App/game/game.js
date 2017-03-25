'use strict';

var componentController = function ($location, authService) {
    const ctrl = this;


    ctrl.$onInit = function () {
        //todo: start game?
    };
};

angular.module('auth')
    .component('game', {
        bindings: {},
        templateUrl: 'app/game/game.html',
        controller: componentController
    });