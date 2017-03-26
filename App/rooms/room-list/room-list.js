'use strict';

var componentController = function ($controller, $location, authService, roomService) {
	const ctrl = this;

	$controller('authCheck', {});
	$controller('isInRoomCheck', {});
	

	ctrl.updateRooms = function () {
		roomService.getRoomList().then(function (rooms) {
			ctrl.rooms = rooms;
		});
	};

	ctrl.createRoom = function () {
		const roomName = 'room' + Date.now();
		roomService.createRoom(roomName).then(function (data) {
			//creation ok
			$location.path('/rooms/' + data['Id']);
		}, function (error) {
			console.log('room creation error', error);
			ctrl.updateRooms();
		});
	};

	ctrl.joinRoom = function (roomId) {
		roomService.joinRoom(roomId).then(function (data) {
			//creation ok
			$location.path('/rooms/' + data['Id']);
		}, function (error) {
			console.warn(error.message);
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