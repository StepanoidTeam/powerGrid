'use strict';

angular.module('auth', [])
	.service('authService', function ($q, $location, apiEndpoints, errorHandler) {
		const svc = this;

		const isLoggedSubject = new Rx.Subject();
		svc.isLogged = isLoggedSubject.distinctUntilChanged();

		const playerSubject = new Rx.Subject();
		svc.player = playerSubject.distinctUntilChanged((a, b) => {
			return a && b && a.Id === b.Id;
		});


		svc.login = function (userData) {
			return apiEndpoints.login(userData)
				.then(() => isLoggedSubject.next(true))
				.catch(function (error) {
					errorHandler(error);
					return svc.logout();
				});
		};

		svc.logout = function () {
			apiEndpoints.logout().then(() => isLoggedSubject.next(false));
			return Promise.resolve();
		};


		svc.register = function (username, password) {

		};


		svc.currentPlayer = null;

		svc.player.subscribe(player => {
			svc.currentPlayer = player;
		});


		svc.getPlayerStatus = function () {
			return apiEndpoints.getPlayerStatus()
				.then(function (response) {
					playerSubject.next(response.data);
					isLoggedSubject.next(true);
				}, function (error) {
					playerSubject.next(null);
					isLoggedSubject.next(false);
					errorHandler(error);
					svc.logout();
					$location.path('init');
				});
		};

		/////looks shitty
		svc.isLogged.subscribe(function (isLogged) {
			if (isLogged) {
				svc.getPlayerStatus();
			} else {
				playerSubject.next(null);
			}
		});


		//debug
		svc.player.subscribe(player => {
			console.log('player', player);
		});

		svc.isLogged.subscribe((data) => {
			console.log('isLogged', data);
		});


		svc.$onInit = function () {
		};
	});
