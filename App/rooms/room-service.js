'use strict';

angular.module('rooms', [])
.service('roomService', function ($q, $http, apiConfig, authService) {
	var svc = this;

	var userId;

	authService.checkAuth().then(function (user) {
		userId = user.userId;
	});

	svc.getRoomList = function () {
		var url = apiConfig.apiUrl + 'rooms/' + userId;

		return $http.get(url).then(function (rooms) {
			return rooms.data.data;
		});
	};

	svc.getRoom = function (id) {
		var url = apiConfig.apiUrl + 'room/1/' + userId;

		return $http.get(url).then(function (room) {
			return room.data.data;
		});
	};

	svc.createRoom = function (roomName) {
		var url = apiConfig.apiUrl + 'rooms/create' + '/' + userId + '/' + roomName;
		return $http.post(url, { userId: userId, name: roomName });
	};


	svc.getPlayerStatus = function () {
		var url = apiConfig.apiUrl + 'status/player' + '/' + userId;
		return $http.get(url);
	};

});