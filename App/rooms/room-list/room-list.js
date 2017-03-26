'use strict';

var componentController = function ($controller, $location, authService, roomService, errorHandler) {
	const ctrl = this;

	$controller('authCheck', {});
	$controller('isInRoomCheck', {});

	ctrl.updateRooms = function () {
		roomService.getRoomList().then(function (rooms) {
			ctrl.rooms = rooms.filter(room => !room.IsInGame);
		}).catch(errorHandler);
	};

	ctrl.createRoom = function () {
		const roomName = 'room' + Date.now();
		roomService.createRoom(roomName).then(function (data) {
			//creation ok
			$location.path('/rooms/' + data['Id']);
		}).catch(errorHandler)
			.then(ctrl.updateRooms);
	};

	ctrl.joinRoom = function (roomId) {
		roomService.joinRoom(roomId).then(function (data) {
			//creation ok
			$location.path('/rooms/' + data['Id']);
		}).catch(errorHandler)
			.then(ctrl.updateRooms);
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
