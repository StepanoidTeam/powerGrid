'use strict';

angular.module('rooms', [])
.service('roomService', function ($q, apiEndpoints, apiWsEndpoints, authService) {
	var svc = this;


	svc.getRoomList = function (params) {
		return apiEndpoints.getRoomList(params);
	};

	//todo: client-side API mock
	svc.getRoom = function (roomId) {
		//return apiEndpoints.getRoom(roomId); //todo: nesuwestvuet!!1
		return svc.getRoomList().then(function (rooms) {
			var currentRoom = rooms.find((r) =>r['Id'] === roomId);
			if (currentRoom)
				return currentRoom;
			else
				return $q.reject({ message: 'no room found', roomId: roomId });
		});
	};

	svc.createRoom = function (roomName) {
		return apiEndpoints.createRoom({ name: roomName });
	};

	svc.joinRoom = function (roomId) {
		return apiEndpoints.joinRoom({ roomId: roomId });
	};

	svc.leaveRoom = function () {
		return apiEndpoints.leaveRoom();
	};

	svc.kickUser = function (userId) {
		return apiEndpoints.kickUser({ username: userId });
	};


	svc.startGameRoom = function () {
		return apiEndpoints.startGameRoom();
	};


	
	

	svc.onRoomsUpdated = function () {
		//todo: podpisatsa nado
		//apiWsEndpoints
	};

});