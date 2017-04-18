angular.module('app')
	.service('chatService', function (apiEndpoints, apiWsEndpoints, authService) {
		const svc = this;

		svc.isDisabled = new Rx.Subject();
		svc.isOpen = new Rx.Subject();

		svc.chatMessages = apiWsEndpoints.wsSource.filter(
			wsData => {
				return wsData.Date !== undefined
			}
		);

		svc.getLastMessages = function () {
			return apiEndpoints.getChatChannels()
				.then(response => response.data)
				.then(channels => channels.find(channel => channel.Name === "Global"))
				.then(channel => channel.Id)
				.then(channelId => {
					return apiEndpoints.getChatMessages(channelId)
				})
				.then(response => response.data);
		};


		authService.player.subscribe(p => {
			apiWsEndpoints.handshake();
		});

		svc.systemMessages = apiWsEndpoints.wsSource.filter(wsData => {
			return wsData.Data !== undefined;
		}).map(wsData => wsData.Data);


		svc.sendMessage = function (message, channelId) {
			return apiWsEndpoints.sendChatMessage(message, channelId);
		};

		svc.toggleChat = function (value) {
			svc.isOpen.next(value);
		};


		svc.$onInit = function () {
			svc.isDisabled.next(true);

			authService.isLogged.subscribe(isLogged => {
				svc.isDisabled.next(!isLogged);

				if (!isLogged) {
					svc.chatMessages.length = 0;
				}
			});
		};

		svc.$onInit();

	});
