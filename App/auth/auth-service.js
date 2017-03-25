'use strict';

angular.module('auth', [])
    .service('authService', function ($q, $location, apiEndpoints, chatService) {
        const svc = this;

        svc.login = function (userData) {
            return apiEndpoints.login(userData).then(function (data) {
                chatService.sendMessage(`${userData.username} logined`);
            }).catch(function (error) {
                //error on login
                console.warn('login failed');
                return svc.logout()//.then(() =>$location.path('init'));;
            });
        };

        svc.logout = apiEndpoints.logout;

        svc.register = function (username, password) {

        };


        svc.playerSubject = new Rx.Subject();

        svc.getPlayerStatus = function () {
            return apiEndpoints.getPlayerStatus().then(function (player) {
                svc.playerSubject.next(player);
                console.info('status ok', player);
            }, function (error) {
                console.warn('failed to login', error);
                svc.playerSubject.next(null);
                svc.logout();
                $location.path('init');
            });
        };


        //debug
        svc.playerSubject.subscribe((data) => {
            console.info('player status changed', data);
        });

        apiEndpoints.isLoggedSubject.subscribe((data) => {
            console.info('is logged status changed', data);
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
            //svc.getPlayerStatus().then((e)=>console.info(e));
        };


        //svc.$onInit();
    });