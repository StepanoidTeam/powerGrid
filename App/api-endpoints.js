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


		//todo: maybe do unauth redirect here?
	}

	function apiResp(httpResponse) {
		//var isSuccess  = httpResponse.data.isSuccess;
		var isSuccess = httpResponse.status === 200;//ambigous   && httpResponse.data.status === ok

		/*
			All Possible response statuses: 

			Ok, 
			UnexpectedError, 
			Unauthorized, 
			NotInRoom, 
			NotInGame, 
			NotYourTurn,
			NotFound, 
			InvalidModel, 
			NotAllowed, 
			NotAllowActionInThisPhase
		*/


		if (isSuccess) {
			return $q.when(httpResponse.data.data);
		} else {
			return $q.reject(httpResponse.data);
		}
	}


	svc.getVersion = function () {
		return httpRequest('GET', 'version');
	};


	/* USER */



	//POST /api/User/Status
	svc.isAuthorized = function () {
		// todo: use POST /api/User/Status instead
		// checkauth is deprecated ANYMOR
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