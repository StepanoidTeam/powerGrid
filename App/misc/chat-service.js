angular.module('app')
    .service('chatService', function (apiEndpoints, apiWsEndpoints, $timeout) {
        const svc = this;


        svc.chatMessages = apiWsEndpoints.wsSource.filter(
            wsData => {
                return wsData.Date !== undefined
            }
        );

        svc.getLastMessages = function () {
            return apiEndpoints.getChatChannels()
                .then(data => data.data)
                .then(channels => channels.find(channel => channel.Name === "Global"))
                .then(channel => channel.Id)
                .then(channelId => {
                    return apiEndpoints.getChatMessages(channelId)
                })
                .then(data => data.data);
        };


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
