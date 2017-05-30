'use strict';

var componentController = function ($scope, $timeout, chatService, authService) {
	const ctrl = this;

	ctrl.chatMessages = [];

	function getSenderColor(senderId) {
		return '#' + senderId.substr(0, 6);
	}

	function chatMessageMapper(message) {
		message.SenderColor = getSenderColor(message.SenderId);
		message.isSelf = message.SenderId === (authService.currentPlayer && authService.currentPlayer.Id);
		return message;
	}

	function updateChatMessages(message) {
		ctrl.chatMessages.push(message);
		$scope.$applyAsync();

		$timeout(function () {
			const lastItem = document.querySelector('chat ul>li:last-child');
			if (lastItem) lastItem.scrollIntoView();
		}, 0, false);
	}

	chatService.onChatMessage.map(chatMessageMapper).subscribe(updateChatMessages);

	chatService.onSystemMessage.map(chatMessageMapper).subscribe(updateChatMessages);



	ctrl.toggleChat = chatService.toggleChat;

	ctrl.chatMessage = 'type msg here';

	ctrl.messageChanged = function (value) {
		ctrl.chatMessage = value;
	};

	ctrl.sendMessage = function (value) {
		chatService.sendMessage(value);
		ctrl.chatMessage = '';
	};




	authService.isLogged.filter(value => value === true).subscribe(function () {
		chatService.getLastMessages()
			.then(messages => messages.map(chatMessageMapper))
			.then(messages => {
				ctrl.chatMessages.push(...messages);
			});
	});

};

angular.module('app')
	.component('chat', {
		bindings: {},
		templateUrl: 'app/misc/chat/chat.html',
		controller: componentController
	});
