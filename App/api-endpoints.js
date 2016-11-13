'use strict';

angular.module('app')
.service('apiEndpoints', function ($q, $http, tokenService, apiConfig) {
	var svc = this;

	function httpRequest(httpMethod, apiMethod, data) {

		var headers = { authToken: tokenService.getToken() };

		var url = apiConfig.apiUrl + apiMethod;

		return $http({
			method: httpMethod,//'POST',
			url: url,
			data: data,
			headers: headers
		}).then(apiResp, apiResp);
	}

	function apiResp(response) {
		//var isSuccess  = response.data.isSuccess;
		var isSuccess = response.status === 200;

		if (isSuccess) {
			return $q.when(response.data.data);
		} else {
			return $q.reject(response.data);
		}
		//return $q.when(response.data);
	}


	svc.getVersion = function () {
		return httpRequest('GET', 'version');
	};


	/* USER */

	svc.isAuthorized = function () {
		return httpRequest('POST', 'user/CheckAuthorization');
	};


	svc.login = function (userModel) {
		return httpRequest('POST', 'user/Login', userModel)
			.then(tokenService.mapToken)
			.then(tokenService.saveToken);
	};


	svc.logout = function () {
		return httpRequest('POST', 'user/Logout').then(tokenService.deleteToken);
	};

	/* ROOMS */

	//GET /api/Rooms 
	svc.getRooms = function () {
		return httpRequest('GET', 'Rooms');
	};

	//GET /api/Rooms 
	//Rooms list
	svc.getRoomList = function (params) {
		return httpRequest('POST', 'Rooms/List', params || {});
	};

	//POST /api/Rooms/Create/{name}
	svc.createRoom = function (params) {
		return httpRequest('POST', 'Rooms/CREATE', params);
	};

	//POST /api/Rooms/List

	//POST /api/Rooms/Join 
	//Join player into specific room
	//roomId
	svc.joinRoom = function (params) {
		return httpRequest('POST', 'Rooms/JOIN', params);
	};

	//POST /api/Rooms/Leave 
	//Leave from current room
	svc.leaveRoom = function () {
		return httpRequest('POST', 'Rooms/LEAVE');
	};

	//POST /api/Rooms/Kick 
	//Kick another player from the room if current user have enough permissions
	svc.kickUser = function (params) {
		return httpRequest('POST', 'Rooms/kick', params);
	};


	//POST /api/Rooms/ToggleReady 
	/* { "state": true } */
	//Set if player ready to start or not
	svc.ToggleReadyRoom = function (params) {
		return httpRequest('POST', 'Rooms/ToggleReady', params);
	};

	//GET /api/Rooms/StartGame 
	//Initiate game

	svc.startGameRoom = function () {
		//todo: change to POST on serv and here
		return httpRequest('GET', 'Rooms/StartGame');
	};


	//GET /api/USER/Status
	//Player info
	svc.getPlayerStatus = function () {
		var params = {
			"gameRoomId": true,
			"readyMark": true,
			"id": true,
			"name": true
		};

		return httpRequest('POST', 'user/Status', params);
	};

});