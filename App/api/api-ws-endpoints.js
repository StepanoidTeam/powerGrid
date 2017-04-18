'use strict';

angular.module('app')
	.service('apiWsEndpoints', function ($q, $http, tokenService, apiConfig) {
		const svc = this;
		//init
		const webSocket = new WebSocket(apiConfig.wsUrl);
		svc.wsSource = Rx.Observable
			.fromEvent(webSocket, 'message')//'open' 'close' 'error'
			.map(wsEvent => {
				const dataRaw = wsEvent.data;
				return JSON.parse(dataRaw || "{}");//todo: dirty hack - remove
			});


		svc.wsSource.subscribe((data) => {
			//console.log('wss',data);
		});


		function wsRequest(wsMethod, wsData = {}) {

			wsData.AuthToken = tokenService.getToken();
			wsData.Type = wsMethod;

			const requestString = JSON.stringify(wsData);
			webSocket.send(requestString);
		}

		/* CHAT */

		svc.handshake = function () {
			console.log('handshake');
			wsRequest('USERSTATUS');
		};

		svc.sendChatMessage = function (message, channelId) {
			//todo: remove inroom
			//todo: rename toUserId to receiver or channelId/subscriberID
			const wsData = {
				Message: message,
				Channel: channelId || null,
			};

			wsRequest('CHAT', wsData);
		};
	});
