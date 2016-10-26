'use strict';

var componentController = function ($controller, authService, roomService) {
	var ctrl = this;

	$controller('authCheck', {});

	//ctrl.rooms = [];

	ctrl.updateRooms = function () {
		roomService.getRoomList().then(function (rooms) {
			ctrl.rooms = rooms;
		});
	};

	ctrl.createRoom = function (roomName) {
		roomService.createRoom(roomName + Date.now()).then(function () {
			ctrl.updateRooms();
		});
	};
	
	//init
	ctrl.updateRooms();
};

angular.module('rooms')
	.component('roomList', {
		bindings: {
			rooms: '<'
		},
		templateUrl: 'app/rooms/room-list/room-list.html',
		controller: componentController
	});