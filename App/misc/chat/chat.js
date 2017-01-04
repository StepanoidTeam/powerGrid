'use strict';

var componentController = function ($scope,$timeout, chatService) {
    var ctrl = this;

    ctrl.chatMessages = [];

    function updateChat(data) {
        data.Time = new Date(data.Date).toLocaleTimeString();
        ctrl.chatMessages.push(data);
        $scope.$applyAsync();

        $timeout(function() {
            var lastItem = document.querySelector('chat ul>li:last-child');
            if (lastItem)lastItem.scrollIntoView();
        }, 0, false);
    }

    chatService.subscribe(updateChat);

    //chatService.sendMessage(message, to);

    ctrl.chatMessage = 'type message here';

    ctrl.messageChanged = function (value) {
        ctrl.chatMessage = value;
    };

    ctrl.sendMessage = function (value) {
        chatService.sendMessage(value);

        //ctrl.chatMessage = '';
    };

};

angular.module('app')
    .component('chat', {
        bindings: {},
        templateUrl: 'app/misc/chat/chat.html',
        controller: componentController
    });