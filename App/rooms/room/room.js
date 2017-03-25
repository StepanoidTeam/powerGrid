'use strict';

var componentController = function ($controller, $location, roomService, apiEndpoints) {
	var ctrl = this;

	$controller('authCheck', {});

	ctrl.room = function () {

		//apiEndpoints.getRoom(ctrl.roomId);

	};

	ctrl.testCheck = true;


	ctrl.kickUser = function (userId) {
		roomService.kickUser(userId)
			.then(() =>ctrl.initRoom(ctrl.roomId));
	};


	ctrl.leaveRoom = function () {
		roomService.leaveRoom().then(() =>$location.path('/rooms'));
	};


	ctrl.startGameRoom = function () {
		roomService.startGameRoom()
			.then((data) =>console.info(data))
			.then(() =>$location.path('/game/'));
	};

	ctrl.initRoom = function (roomId) {
		roomService.getRoom(roomId).then(function (room) {
			ctrl.room = room;
		}, function (error) {
			console.warn(error);
			$location.path('/rooms');
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