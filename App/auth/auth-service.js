'use strict';

angular.module('auth', [])
	.service('authService', function ($location,tokenService, apiEndpoints, apiWsEndpoints,  errorHandler, versionService) {
		const svc = this;

		//todo: use behaviorSubj
		const isLoggedSubject = new Rx.BehaviorSubject(false);
		svc.isLogged = isLoggedSubject.distinctUntilChanged();

		//todo: use behaviorSubj
		const playerSubject = new Rx.BehaviorSubject(null);
		svc.player = playerSubject.distinctUntilChanged((a, b) => {
			return a && b && a.Id === b.Id;
		});



		Rx.Observable.combineLatest(
			svc.isLogged, versionService.apiOk,
			(users, player) => users.find(u => u.Id === player.Id));





		svc.player.filter(player => player === null).subscribe(
			//todo: handle this another way
			() => $location.path('/login')
		);

		svc.player.filter(player => player !== null).subscribe(
			() => $location.path('/ROOM/List')
		);


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

			apiWsEndpoints.close();
			return Promise.resolve();
		};


		svc.isLogged.filter(isLogged => isLogged)
			.subscribe(() => apiWsEndpoints.open());


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

					//todo: handle this another way
					$location.path('/login');
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
			console.log('👾player', player);
		});

		svc.isLogged.subscribe((data) => {
			console.log('🔑isLogged', data);
		});


		svc.$onInit = function () {
			let exists = tokenService.tokenExists();
			if (exists) {
				svc.getPlayerStatus();
			}
		};

		svc.$onInit();
	});
