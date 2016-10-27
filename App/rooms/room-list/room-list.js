'use strict';

var componentController = function ($controller, $location, authService, roomService) {
	var ctrl = this;

	$controller('authCheck', {});

	//ctrl.rooms = [];

	ctrl.updateRooms = function () {
		roomService.getRoomList().then(function (rooms) {
			ctrl.rooms = rooms;
		});
	};

	ctrl.createRoom = function (roomName) {
		roomService.createRoom(roomName + Date.now()).then(function (data) {
			
			if (data.data.isSuccess) {
				//creation ok
				$location.path('/rooms/' + data.data);
			} else {
				//mb already in room?
				roomService.getPlayerStatus().then(function (data) {
					if (data.data.isSuccess) {
						if (data.data.data.GameRoomId) {
							$location.path('/rooms/' + data.data.data.GameRoomId);
						}
					} else {
						ctrl.updateRooms();
					}
				});
			}
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