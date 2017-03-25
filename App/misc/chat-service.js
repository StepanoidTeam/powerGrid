angular.module('app')
    .service('chatService', function (apiEndpoints, apiWsEndpoints, $timeout) {
        const svc = this;


        svc.chatMessages = apiWsEndpoints.wsSource.filter(
            wsData => {
                return wsData.Date !== undefined
            }
        );

        svc.systemMessages = apiWsEndpoints.wsSource.filter(wsData => {
            return wsData.Data !== undefined;
        }).map(wsData => wsData.Data);

        svc.isOpen = new Rx.Subject();

        svc.sendMessage = function (message, to) {
            return apiWsEndpoints.chatSendMessage(message, to);
        };

        svc.chatToggle = function (value) {
            svc.isOpen.next(value);
        };

    });
