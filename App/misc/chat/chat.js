'use strict';

var componentController = function ($scope, $timeout, chatService) {
    var ctrl = this;

    ctrl.chatMessages = [];

    function updateChatMessages(chatMessage) {
        chatMessage.Time = chatMessage.Date.toString().split('T')[1];
        chatMessage.SenderColor = getSenderColor(chatMessage.SenderId);

        ctrl.chatMessages.push(chatMessage);
        $scope.$applyAsync();

        $timeout(function() {
            const lastItem = document.querySelector('chat ul>li:last-child');
            if (lastItem)lastItem.scrollIntoView();
        }, 0, false);
    }

    function updateChatSystem(systemMessage) {
        console.info('sys',systemMessage);
    }

    chatService.chatMessages.subscribe(updateChatMessages);

    chatService.systemMessages.subscribe(updateChatSystem);

    function getSenderColor(senderId){
        return '#' + senderId.substr(0,6);
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

};

angular.module('app')
    .component('chat', {
        bindings: {},
        templateUrl: 'app/misc/chat/chat.html',
        controller: componentController
    });