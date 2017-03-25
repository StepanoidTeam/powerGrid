'use strict';

var componentController = function ($scope, $timeout, chatService) {
    var ctrl = this;

    ctrl.chatMessages = [];

    function updateChat(data) {

        if(data.Date===undefined){
            console.warn('no date provided',data);
            return;
        }

        data.Time = data.Date.toString().split('T')[1];
        data.SenderColor = getSenderColor(data.SenderId);

        ctrl.chatMessages.push(data);
        $scope.$applyAsync();

        $timeout(function() {
            var lastItem = document.querySelector('chat ul>li:last-child');
            if (lastItem)lastItem.scrollIntoView();
        }, 0, false);
    }

    chatService.subscribe(updateChat);

    function getSenderColor(senderId){


        // const color = {
        //     r: parseInt(senderId.substr(0,2),16),
        //     g: parseInt(senderId.substr(2,2),16),
        //     b: parseInt(senderId.substr(4,2),16),
        // };

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