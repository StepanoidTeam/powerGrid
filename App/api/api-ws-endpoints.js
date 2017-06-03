'use strict';

angular.module('app')
	.service('apiWsEndpoints', function (webSocket) {
		const svc = this;


		svc.wsMessage = webSocket.wsMessage;

		svc.open = async () => {
			await webSocket.open();
			webSocket.send('USERSTATUS');
			console.log('handshake');
		};

		svc.close = () => webSocket.close();


		svc.wsMessage.subscribe((data) => {
			console.log('wss', data);
		});

		/* CHAT */

		svc.sendChatMessage = function (message, channelId) {
			//todo: remove inroom
			//todo: rename toUserId to receiver or channelId/subscriberID
			const wsData = {
				Message: message,
				Channel: channelId || null,
			};

			webSocket.send('CHAT', wsData);
		};
	});
