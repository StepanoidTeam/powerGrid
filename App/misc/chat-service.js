angular.module('app')
    .service('chatService', function (apiEndpoints, apiWsEndpoints, $timeout) {
        const svc = this;

        svc.subscribe = apiWsEndpoints.chatSubscribe;
        svc.isOpen = new Rx.Subject();

        svc.sendMessage = function (message, to) {
            return apiWsEndpoints.chatSendMessage(message, to);
        };

        svc.chatToggle = function (value) {
            svc.isOpen.next(value);
        };

    });
