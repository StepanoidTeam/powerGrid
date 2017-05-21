'use strict';

var componentController = function ($scope, $controller, $location, roomService, authService, errorHandler) {
	const ctrl = this;

	$controller('authCheck', {});

	ctrl.currentUser = authService.currentPlayer;

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


	ctrl.users = [];

	ctrl.initRoom = function (roomId) {
		roomService.getRoom(roomId).then(function (room) {
			ctrl.room = room;
		}, function (error) {
			console.warn(error);
			$location.path('/rooms');
		});

		roomService.toggleReadyObservable.subscribe(function () {
			$scope.$applyAsync();
		});

		roomService.roomUsers.subscribe(users=>{
			console.log(users);
			ctrl.users.length=  0;
			ctrl.users.push(...users);
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
