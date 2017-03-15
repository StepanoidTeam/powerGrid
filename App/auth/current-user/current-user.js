'use strict';

var componentController = function ($q, $location, authService) {
    const ctrl = this;

    let isAuth = false;
    ctrl.isAuthorized = function () {
        return isAuth;
    };

    ctrl.logout = function () {
        authService.logout().then(function () {
            $location.path('/init');
        });
    };


    // debug


    //$q.all([, authService.getPlayerStatus()]).then

    ctrl.$onInit = function () {
        authService.onPlayerStatusChange(function (player) {
            if (player) {
                ctrl.userName = player.Name;
                isAuth = true;
            } else {
                isAuth = false;
            }
        });
    };
};

angular.module('auth')
    .component('currentUser', {
        bindings: {},
        templateUrl: 'app/auth/current-user/current-user.html',
        controller: componentController
    });