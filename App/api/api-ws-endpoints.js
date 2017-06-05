'use strict';

angular.module('app')
	.service('apiWsEndpoints', function (webSocket) {
		const svc = this;


		svc.wsMessage = webSocket.wsMessage;

		svc.open = async () => {
			await webSocket.open();
			webSocket.send('AUTHSTATUS');
			console.log('🤝ws handshake sent🤝');
		};

		svc.close = () => webSocket.close();


		svc.wsMessage.subscribe((data) => {
			//debug
			console.log('📢wss', data);
		});

		/* CHAT - CHANNEL */

		svc.sendChatMessage = function (message, channelId) {
			const wsData = {
				Message: message,
				Channel: channelId || null,
			};

			webSocket.send('CHANNELSEND', wsData);
		};
	});
