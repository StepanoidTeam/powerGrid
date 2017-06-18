'use strict';

var componentController = function ($scope, $timeout, chatService, authService, notificationService, pageStateService) {
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

	//show notifications only when page is hidden
	let chatMessageWhenHidden = pageStateService.rxIsVisible
		.switchMap(isVisible => isVisible ? Rx.Observable.never() : chatService.onChatMessage);


	chatMessageWhenHidden.subscribe(msg => notificationService.showNotification(msg.SenderName, msg.Message, msg.SenderId));
	chatMessageWhenHidden.subscribe(() => console.log(document.hidden));


	//cleanup chat history on logout
	authService.isLogged
		.filter(isLogged => isLogged === false)
		.subscribe(() => ctrl.chatMessages.splice(0));


	ctrl.toggleChat = chatService.toggleChat;

	ctrl.chatMessage = `first message here ${ new Date().toISOString()}`;

	ctrl.messageChanged = function (value) {
		ctrl.chatMessage = value;
	};


	ctrl.keyPressed = function (event) {
		if (event.keyCode === 13) {
			ctrl.sendMessage(ctrl.chatMessage);
			event.preventDefault();
		}

		if (event.keyCode === 10 && event.ctrlKey === true) {
			ctrl.chatMessage += '\n';
			event.preventDefault();
		}
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
