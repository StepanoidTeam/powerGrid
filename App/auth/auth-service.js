'use strict';

angular.module('auth', [])
	.service('authService', function ($q, $location, apiEndpoints,errorHandler) {
		const svc = this;

		svc.login = function (userData) {
			return apiEndpoints.login(userData).catch(function (error) {
				errorHandler(error);
				return svc.logout();
			});
		};

		svc.logout = apiEndpoints.logout;

		svc.register = function (username, password) {

		};


		svc.playerSubject = new Rx.Subject();
		svc.isLoggedSubject = apiEndpoints.isLoggedSubject.distinctUntilChanged();

		svc.currentPlayer = null;

		svc.playerSubject.subscribe(player => {
			svc.currentPlayer = player;
		});


		svc.getPlayerStatus = function () {
			return apiEndpoints.getPlayerStatus()
				.then(function (response) {
					svc.playerSubject.next(response.data);
				}, function (error) {
					svc.playerSubject.next(null);
					errorHandler(error);
					svc.logout();
					$location.path('init');
				});
		};

		/////looks shitty
		svc.isLoggedSubject.subscribe(function (isLogged) {
			if (isLogged) {
				svc.getPlayerStatus();
			} else {
				svc.playerSubject.next(null);
			}
		});


		//debug
		svc.playerSubject.distinctUntilChanged(player => player && player.Id).subscribe(player => {
			console.log('player status changed', player);
		});

		svc.isLoggedSubject.subscribe((data) => {
			console.log('is logged status changed', data);
		});


		svc.$onInit = function () {
		};
	});
