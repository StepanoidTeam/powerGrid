angular.module('app')
	.service('chatService', function (apiEndpoints, apiWsEndpoints, authService, apiUser) {
		const svc = this;

		svc.isDisabled = new Rx.Subject();
		svc.isOpen = new Rx.Subject();


		//todo: move to chat api


		svc.onChatMessage = apiWsEndpoints.wsMessage.filter(msg => msg.EntityType === 'ChatMessage');


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


		svc.onSystemMessage = Rx.Observable.merge(
			//login users
			apiUser.onLogin.map(msg => ({
				Message: `${ msg.Name } logged in`,
				SenderId: msg.Id,
				SenderName: 'system',
				Date: new Date(),
			})),
			//logout messages
			apiUser.onLogout.map(msg => ({
				Message: `${ msg.Name } logged out`,
				SenderId: msg.Id,
				SenderName: 'system',
				Date: new Date(),
			}))
		);


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

				// if (!isLogged) {
				// 	svc.chatMessages.length = 0;
				// }
			});
		};

		svc.$onInit();

	});
