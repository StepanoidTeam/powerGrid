'use strict';

var componentController = function ($scope, $timeout, chatService, authService) {
    const ctrl = this;

    ctrl.chatMessages = [];


    function messageMapper(message) {
        message.Time = message.Date.toString().split('T')[1];
        message.SenderColor = getSenderColor(message.SenderId);
        message.isSelf = message.SenderId === (authService.currentPlayer && authService.currentPlayer.Id);
        return message;
    }

    function updateChatMessages(message) {
        ctrl.chatMessages.push(messageMapper(message));
        $scope.$applyAsync();

        $timeout(function () {
            const lastItem = document.querySelector('chat ul>li:last-child');
            if (lastItem) lastItem.scrollIntoView();
        }, 0, false);
    }

    function updateChatSystem(message) {
        console.info('sys', message);
    }

    chatService.chatMessages.subscribe(updateChatMessages);

    chatService.systemMessages.subscribe(updateChatSystem);

    function getSenderColor(senderId) {
        return '#' + senderId.substr(0, 6);
    }

    ctrl.chatToggle = chatService.chatToggle;

    ctrl.chatMessage = 'type message here';

    ctrl.messageChanged = function (value) {
        ctrl.chatMessage = value;
    };

    ctrl.sendMessage = function (value) {
        chatService.sendMessage(value);
        ctrl.chatMessage = '';
    };


    authService.isLoggedSubject.filter(value => value).subscribe(function () {
        chatService.getLastMessages()
            .then(messages => messages.map(messageMapper))
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