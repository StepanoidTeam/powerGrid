'use strict';

angular.module('app')
	.service('apiEndpoints', function ($http, tokenService, apiConfig) {
		const svc = this;
		//init
		const apiUrl = apiConfig.apiUrl;

		function apiRequest(httpMethod, apiMethod, data) {

			const headers = {authToken: tokenService.getToken()};

			const url = apiUrl + apiMethod;

			return $http({
				method: httpMethod,//'POST',
				url: url,
				data: data || {},
				headers: headers
			}).then(apiResponse, apiResponse);


			//todo: maybe do unauth redirect here?
		}

		function apiResponse(httpResponse) {
			const isSuccess = httpResponse.status === 200;//todo: ambigous   && httpResponse.data.status === ok

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
				return Promise.resolve(httpResponse.data.data);
			} else {
				return Promise.reject(httpResponse.data);
			}
		}


		svc.getVersion = function () {
			return apiRequest('GET', 'VERSION');
		};


		/* AUTH */

		svc.login = function (userModel) {
			return apiRequest('POST', 'AUTH/Login', userModel)
				.then(tokenService.mapToken)
				.then(tokenService.saveToken);
		};

		svc.logout = function () {
			return apiRequest('POST', 'AUTH/logout')
				.finally(tokenService.deleteToken);
		};

		//GET /api/AUTH/Status
		svc.getPlayerStatus = function () {
			const params = {
				"gameRoomId": true,
				"readyMark": true,
				"id": true,
				"name": true
			};

			return apiRequest('POST', 'AUTH/Status', params);
		};


		/* ROOM */

		//GET /api/Room/List
		svc.getRooms = function () {
			//todo: is it used?
			return apiRequest('GET', 'ROOM/List');
		};

		//GET /api/ROOM
		//ROOM list
		svc.getRoomList = function (params) {
			return apiRequest('POST', 'ROOM/List', params);
		};

		//POST /api/ROOM/Create/{name}
		svc.createRoom = function (params) {
			return apiRequest('POST', 'ROOM/create', params);
		};

		//POST /api/ROOM/List

		//POST /api/ROOM/Join
		//Join player into specific room
		//roomId
		svc.joinRoom = function (params) {
			return apiRequest('POST', 'ROOM/join', params);
		};

		//POST /api/ROOM/Leave
		//Leave from current room
		svc.leaveRoom = function () {
			return apiRequest('POST', 'ROOM/leave');
		};

		//POST /api/ROOM/Kick
		//Kick another player from the room if current user have enough permissions
		svc.kickUser = function (params) {
			return apiRequest('POST', 'ROOM/kick', params);
		};


		//POST /api/ROOM/ToggleReady
		/* { "state": true } */
		//Set if player ready to start or not
		svc.toggleReadyRoom = function (params) {
			return apiRequest('POST', 'ROOM/ToggleReady', params);
		};

		//GET /api/ROOM/StartGame
		//Initiate game

		svc.startGameRoom = function () {
			//todo: change to POST on serv and here
			return apiRequest('GET', 'ROOM/StartGame');
		};


		//GET /api/Chat/Channels
		svc.getChatChannels = function () {
			return apiRequest('GET', 'CHANNEL/List');
		};

		//POST /api/Chat/GetMessages
		svc.getChatMessages = function (channelId) {
			const params = {
				"channelId": channelId,
				"start": (new Date(new Date() - 1000 * 60 * 60)).toISOString(),
				"end": (new Date()).toISOString()
			};

			return apiRequest('POST', 'CHANNEL/GetMessages', params);
		};


		//GAME
		//GET /api/Maps
		svc.getGameMaps = function () {
			return apiRequest('GET', 'MAPS');
		};

		//POST /api/Maps/Map
		svc.getGameMapById = function (mapId) {
			const params = {
				"mapId": mapId,
				"options": {
					"cities": true,
					"regions": true,
					"connectors": true,
					"cityViewOptions": {
						"regionKey": true,
						"regionName": true,
						"coords": true,
						"levels": true,
						"conntectors": true,
						"connectorViewOptions": {
							"id": true,
							"cost": true,
							"cityKeys": true,
							"cityNames": true
						},
						"id": true,
						"name": true
					},
					"connectorViewOptions": {
						"id": true,
						"cost": true,
						"cityKeys": true,
						"cityNames": true
					},
					"regionViewOptions": {
						"isLocked": true,
						"cities": true,
						"cityViewOptions": {
							"regionKey": true,
							"regionName": true,
							"coords": true,
							"levels": true,
							"conntectors": true,
							"connectorViewOptions": {
								"id": true,
								"cost": true,
								"cityKeys": true,
								"cityNames": true
							},
							"id": true,
							"name": true
						},
						"id": true,
						"name": true
					}
				}
			};


			//regex: (.+),(.+) : (\d+),(\d+)

			return apiRequest('POST', 'MAPS/Map', params);
		};


		svc.getGameStatus = function (params) {
			return apiRequest('POST', 'GAME/Status', params);
		};


		window.apiSvc = svc;
	});
