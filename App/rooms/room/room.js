'use strict';

var componentController = function ($scope, $controller, $location, roomService, authService, errorHandler) {
	const ctrl = this;

	ctrl.player = authService.player;

	ctrl.toggleReady = function (isReady) {
		roomService.toggleReady(isReady).then(data => {

		});
	};


	ctrl.kickUser = function (userId) {
		roomService.kickUser(userId)
			.then(() => ctrl.initRoom(ctrl.roomId));
	};


	ctrl.leaveRoom = function () {
		roomService.leaveRoom().then(() => $location.path('/rooms'));
	};


	ctrl.startGameRoom = function () {
		roomService.startGameRoom()
			.then((data) => console.info(data))
			.then(() => $location.path('/game/'))
			.catch(errorHandler);
	};


	ctrl.users = new Rx.BehaviorSubject([]);

	ctrl.otherUsers = Rx.Observable.combineLatest(
		ctrl.users, ctrl.player,
		(users, player) => users.filter(u => u.Id !== player.Id));

	ctrl.currentUser = Rx.Observable.combineLatest(
		ctrl.users, ctrl.player,
		(users, player) => users.find(u => u.Id === player.Id));


	ctrl.currentUser.subscribe(() => {
		$scope.$applyAsync();
	});

	ctrl.initRoom = function (roomId) {
		roomService.getRoom(roomId).then(function (room) {
			ctrl.room = room;
		}, function (error) {
			console.warn(error);
			$location.path('/rooms');
		});


		roomService.wsToggleReady.subscribe(function () {
			$scope.$applyAsync();
		});

		roomService.roomUsers.subscribe(users => {
			ctrl.users.next(users);
			$scope.$applyAsync();
		});

	};


	ctrl.$onInit = function () {
		ctrl.initRoom(ctrl.roomId);
	}

};

angular.module('rooms')
	.component('room', {
		bindings: {
			roomId: '<'
		},
		templateUrl: 'app/rooms/room/room.html',
		controller: componentController
	});
