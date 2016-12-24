'use strict';

var componentController = function ($scope,chatService) {
	var ctrl = this;
	
	ctrl.chatMessages = [];

	function updateChat(data) {
		ctrl.chatMessages.push(data);
		$scope.$applyAsync();
	}

	chatService.subscribe(updateChat);

	//chatService.sendMessage(message, to);

	ctrl.chatMessage = 'type message here';

	ctrl.sendMessage = function () {
		chatService.sendMessage(ctrl.chatMessage);
	};

};

angular.module('app')
	.component('chat', {
		bindings: {
		},
		templateUrl: 'app/misc/chat/chat.html',
		controller: componentController
	});