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
		}).then(apiResp);
	}

	function apiResp(response) {
		//if (response.data.isSuccess) {
		//	return $q.when(response.data.data);
		//} else {
		//	return $q.reject(response.data);
		//}
		return $q.when(response.data);
	}


	svc.getVersion = function () {
		return httpRequest('GET', 'version');
	};


	/* USER */
	
	svc.isAuthorized = function (userId) {
		return httpRequest('POST', 'user/CheckAuthorization');
	};


	svc.login = function (userModel) {
		return httpRequest('POST', 'USER/Login', userModel).then(tokenService.saveToken);
	};

	
	svc.logout = function () {
		return httpRequest('POST', 'USER/Logout').then(tokenService.deleteToken);
	};

	/* ROOMS */

	//GET /api/Rooms 
	//Rooms list
	svc.getRoomList = function () {
		return httpRequest('GET', 'Rooms');
	};

	//POST /api/Rooms/Create/{name}
	svc.createRoom = function (params) {
		return httpRequest('POST', 'Rooms/CREATE', params);
	};

	//POST /api/Rooms/List

	//POST /api/Rooms/Join 
	//Join player into specific room

	//POST /api/Rooms/Leave 
	//Leave from current room

	//POST /api/Rooms/Kick 
	//Kick another player from the room if current user have enough permissions

	//POST /api/Rooms/ToggleReady 
	//Set if player ready to start or not

	//GET /api/Rooms/StartGame 
	//Initiate game




	//GET /api/Status/Player 
	//Player info
	svc.getPlayerStatus = function () {
		return httpRequest('GET', 'Status/Player');
	};

});