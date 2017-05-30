'use strict';

angular.module('app')
	.service('apiWsEndpoints', function ($q, $http, tokenService, apiConfig) {
		const svc = this;

		function wsEventMapper(wsEvent) {
			const dataRaw = wsEvent.data;
			//todo: dirty hack - remove
			return JSON.parse(dataRaw || "{}");
		}

		//init
		const webSocket = new WebSocket(apiConfig.wsUrl);
		//'open' 'close' 'error'
		svc.wsMessage = Rx.Observable.fromEvent(webSocket, 'message').map(wsEventMapper);
		//svc.wsOpen = Rx.Observable.fromEvent(webSocket, 'open').map(wsEventMapper);


		svc.wsMessage.subscribe((data) => {
			console.log('wss',data);
		});


		function wsRequest(wsMethod, wsData = {}) {

			wsData.AuthToken = tokenService.getToken();
			wsData.Type = wsMethod;

			const requestString = JSON.stringify(wsData);
			webSocket.send(requestString);
		}

		/* CHAT */

		svc.handshake = function () {
			wsRequest('USERSTATUS');
			console.log('handshake');
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
