'use strict';

angular.module('app')
    .service('apiWsEndpoints', function ($q, $http, tokenService, apiConfig) {
        const svc = this;
        //init
        const webSocket = new WebSocket(apiConfig.wsUrl);
        webSocket.addEventListener('message', wsResponse); //'open' 'close' 'error'



        function wsRequest(wsMethod, wsData) {

            wsData.AuthToken = tokenService.getToken();
            wsData.Type = wsMethod;

            const requestString = JSON.stringify(wsData);
            webSocket.send(requestString);
        }


        function wsResponse(dataEvent) {
            const dataRaw = dataEvent.data;
            const responseObject = JSON.parse(dataRaw);//.replace(/\0/g, '')
            //todo: refac and subscribe directly to ws.event
            svc.subject.next(responseObject);
        }

        //todo: add onClose handler

        svc.wsRequest = wsRequest;

        /* CHAT */
        //todo: add subscribers/rxSubjects to server events
        svc.subject = new Rx.Subject();
        //to log updates
        //svc.subject.subscribe((data) => { console.log('data:', data);});

        svc.chatSendMessage = function (message, subscriberId) {

            //todo: remove inroom
            //todo: rename toUserId to receiver or channelId/subscriberID
            var wsData = {
                Message: message,
                To: subscriberId || null,
                InRoomChannel: false
            };

            return wsRequest('CHAT', wsData);
        };

        svc.chatSubscribe = function (callback) {
            svc.subject.subscribe(callback);
        };

    });