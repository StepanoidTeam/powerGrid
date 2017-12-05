'use strict';

var componentController = function ($scope, $controller, $location, authService, roomService, errorHandler) {
	const ctrl = this;

	ctrl.rooms = [];

	ctrl.updateRooms = function () {
		roomService.getRoomList().then(function (rooms) {
			ctrl.rooms = rooms.filter(room => !room.IsInGame);
		}).catch(errorHandler);
	};


	roomService.roomCreated.subscribe(room => {
		ctrl.rooms.push(room);
		$scope.$applyAsync();
	});

	roomService.roomClosed.subscribe(room => {
		let removedRoomIndex = ctrl.rooms.findIndex(r => r.Id === room.Id);
		if (removedRoomIndex < 0)return;

		ctrl.rooms.splice(removedRoomIndex, 1);
		$scope.$applyAsync();
	});

	ctrl.createRoom = function () {
		const roomName = 'room' + Date.now();
		roomService.createRoom(roomName).then(function (data) {
			//creation ok
			//todo: make common redirect approach
			$location.path('/ROOM/current');
		}).catch(errorHandler)
			.then(ctrl.updateRooms);
	};

	ctrl.joinRoom = function (roomId) {
		roomService.joinRoom(roomId).then(function () {
			//todo: make common redirect approach
			$location.path('/ROOM/current');
		}).catch(errorHandler)
			.then(ctrl.updateRooms);
	};


	//init
	ctrl.updateRooms();
};

angular.module('ROOM')
	.component('roomList', {
		bindings: {
			rooms: '<'
		},
		templateUrl: 'app/rooms/room-list/room-list.html',
		controller: componentController
	});
