'use strict';

angular.module('app')
.service('apiEndpoints', function ($q, $http, $cookies, apiConfig) {
	var svc = this;
	var userCookieKey = 'user';

	function getUrl(method, param) {
		var url = apiConfig.apiUrl + method + (param ? '/' + param : '');
		return url;
	}

	function apiResp(response) {
		if (response.data.isSuccess) {
			return $q.when(response.data.data);
		} else {
			return $q.reject(response.data);
		}
	}

	/*{
		"message": null,
		"isSuccess": true,
		"data": "v0.01"
	}*/
	//GET / api / Version 
	//Get API version
	svc.version = function () {
		return $http.get(getUrl('version')).then(apiResp);
	};

	/*{
		"message": null,
		"isSuccess": true,
		"data": true
	}*/
	//POST / api / CheckAuthorization / { userId } 
	//Check if authorization token (user id) is not expired yet
	svc.isAuthorized = function (userId) {
		return $http.post(getUrl('CheckAuthorization', userId)).then(apiResp);
	};


	/*{
		"message": null,
		"isSuccess": true,
		"data": "bob11"
	}*/
	//POST / api / Login / { username } //Login user
	svc.login = function (userId) {
		return $http.post(getUrl('Login', userId)).then(apiResp);
	};

	/*{
		"message": null,
		"isSuccess": true,
		"data": true
	}*/
	//POST / api / Logout / { userId } //Log out user
	svc.logout = function (userId) {
		return $http.post(getUrl('Logout', userId)).then(apiResp);
	};


	//$q.when("Hello World!")

	
	//GET / api / Status / Game / { userId } //Get status of game if it's active for current user, otherwise it will return appopriate message
	//GET / api / Status / Player / { userId }//Player info

	//// rooms

	//GET / api / Rooms / { userId } //Rooms list
	//POST / api / Rooms / Create / { userId } / { name }
	//POST / api / Rooms / List
	//POST / api / Rooms / Join //Join player into specific room
	//POST / api / Rooms / Leave //Leave from current room
	//POST / api / Rooms / Kick //Kick another player from the room if current user have enough permissions
	//POST / api / Rooms / ToogleReady //Set if player ready to start or not
	//GET / api / Rooms / StartGame //Initiate game



});