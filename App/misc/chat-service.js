angular.module('app')
.service('chatService', function (apiEndpoints, apiWsEndpoints) {
	var svc = this;

	svc.subscribe = apiWsEndpoints.chatSubscribe;

	svc.sendMessage = function (message, to) {
		return apiWsEndpoints.chatSendMessage(message, to);
	};

});
