'use strict';

angular.module('app')
.service('apiWsEndpoints', function ($q, $http, tokenService, apiConfig) {
	var svc = this;
	//init
	var webSocket = new WebSocket(apiConfig.wsUrl);
	webSocket.addEventListener('message', wsResponse);
	//webSocket.addEventListener('open', wsResponse);
	//webSocket.addEventListener('close', wsResponse);
	//webSocket.addEventListener('error', wsResponse);


	function wsRequest(wsMethod, wsData) {

		var headers = { authToken: tokenService.getToken() };

		var wsType = wsMethod;

		wsData.AuthToken = headers.authToken;
		wsData.Type = wsType;
		
		//console.log('ws send', wsData);

		var requestString = JSON.stringify(wsData);
		webSocket.send(requestString);
	}


	function wsResponse(dataEvent) {
		var dataRaw = dataEvent.data;
		var responseObject = JSON.parse(dataRaw);//.replace(/\0/g, '')
		//todo: refac and subscribe directly to ws.event
		svc.subject.next(responseObject);
	}
	

	//todo: add onClose handler

	svc.wsRequest = wsRequest;

	/* CHAT */

	//todo: add subscribers/rxSubjects to server events
	svc.subject = new Rx.Subject();
	//to log updates
	svc.subject.subscribe((data) => { console.log('data:', data);});

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