'use strict';

angular.module('auth', [])
    .service('authService', function ($q, apiEndpoints, chatService) {
        const svc = this;

        svc.login = function (userData) {
            return apiEndpoints.login(userData).then(function (data) {
                chatService.sendMessage(`${userData.username} user logined`);
            }).catch(function (error) {
                //error on login
                return svc.logout();
            });
        };

        svc.logout = apiEndpoints.logout;

        svc.register = function (username, password) {

        };

        svc.getPlayerStatus = apiEndpoints.getPlayerStatus;


        //debug
        apiEndpoints.isLoggedSubject.subscribe((data) => {
            console.info('player status changed:', data);
        });

        svc.onPlayerStatusChange = function (callback) {
            apiEndpoints.isLoggedSubject.subscribe(function (isLogged) {
                if (isLogged) {
                    svc.getPlayerStatus().then(callback);
                } else {
                    callback(isLogged);
                }
            });
        };

        svc.$onInit = function () {
            svc.getPlayerStatus().then((e)=>console.warn(e));
        };


        svc.$onInit();

    });