'use strict';

angular.module('app')
.service('roomService', function ($q, $http, apiConfig, authService) {
	var svc = this;

	svc.getRoomList = function () {
		return authService.getCurrentUser().then(function (user) {
			var url = apiConfig.apiUrl + 'rooms/' + user.userId;
			return $http.get(url).then(function (rooms) {
				return rooms.data.data;
			});
		});
	};

	svc.createRoom = function (roomName) {
		return authService.getCurrentUser().then(function (user) {
			var url = apiConfig.apiUrl + 'rooms/create' + '/' + user.userId + '/' + roomName;
			return $http.post(url, { userId: user.userId, name: roomName });
		});
	};

});