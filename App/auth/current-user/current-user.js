'use strict';

var componentController = function ($location, authService) {
    const ctrl = this;

    let isAuth = false;
    ctrl.isAuthorized = function () {
        return isAuth;
    };

    ctrl.logout = function () {
        authService.logout().then(() => {
            $location.path('/login');
        })
    };

    ctrl.$onInit = function () {
        authService.player.subscribe(player => {
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
