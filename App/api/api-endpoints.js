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
		}

		function apiResponse(httpResponse) {
			const isSuccess = httpResponse.status === 200;
			//todo: ambigous && httpResponse.data.status === ok

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


		svc.getVersion = () => apiRequest('GET', 'VERSION');

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

		svc.getPlayerStatus = function () {
			const params = {
				"gameRoomId": true,
				"lastActivityTime": true,
				"isOnline": true,
				"id": true,
				"name": true
			};

			return apiRequest('POST', 'AUTH/Status', params);
		};


		/* ROOM */

		//todo: is it used?
		svc.getRooms = () => apiRequest('GET', 'ROOM/List');

		svc.getRoomList = (params) => apiRequest('POST', 'ROOM/List', params);

		svc.createRoom = (params) => apiRequest('POST', 'ROOM/create', params);

		svc.joinRoom = (params) => apiRequest('POST', 'ROOM/join', params);

		svc.leaveRoom = () => apiRequest('POST', 'ROOM/leave');

		//Kick another player from the room if current user have enough permissions
		svc.kickUser = (params) => apiRequest('POST', 'ROOM/kick', params);

		/* { "state": true } */
		//Set if player ready to start or not
		svc.toggleReadyRoom = (params) => apiRequest('POST', 'GAME/ToggleReady', params);


		//Initiate game

		//todo: change to POST on serv and here
		svc.startGame = () => apiRequest('GET', 'GAME/Start');

		svc.getChatChannels = () => apiRequest('GET', 'CHANNEL/List');

		svc.getChatMessages = function (channelId) {
			const params = {
				"channelId": channelId,
				"start": (new Date(new Date() - 1000 * 60 * 60)).toISOString(),
				"end": (new Date()).toISOString()
			};

			return apiRequest('POST', 'CHANNEL/GetMessages', params);
		};


		//GAME
		svc.getGameMaps = () => apiRequest('GET', 'MAPS');

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


		svc.getGameStatus = (params) => apiRequest('POST', 'GAME/Status', params);

		svc.changeColor = () => apiRequest('POST', 'GAME/ChangeColor');

		svc.addBot = (params) => apiRequest('POST', 'ROOM/AddBot', params);

		svc.buildCity = (params) => apiRequest('POST', 'Game/BuildPhase/BuildCity',params);


	});
