'use strict';

angular.module('rooms', [])
.service('roomService', function ($q, apiEndpoints, authService) {
	var svc = this;

	
	svc.getRoomList = function () {
		return apiEndpoints.getRoomList();
	};

	svc.getRoom = function (id) {
		return apiEndpoints.getRoom(id);
	};

	svc.createRoom = function (roomName) {
		return apiEndpoints.createRoom({roomName: roomName});
	};
	

});