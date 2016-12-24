'use strict';

angular.module('app')
.service('apiWsEndpoints', function ($q, $http, tokenService, apiConfig) {
	var svc = this;

	//init
	var url = apiConfig.wsUrl;
	var webSocket = new WebSocket(url);
	webSocket.onmessage = wsResp;


	svc.wsRequest = function (data) {
		//var headers = { authToken: tokenService.getToken() };


		//JSON.stringify(data)

	    var request = { AuthToken: tokenService.getToken(), Type: 0, Message: 'I\'m connected, bitches', To: null, InRoomChannel: false };

		var dataJson = JSON.stringify(request);
		console.log('ws send',dataJson);
		webSocket.send(dataJson);
	}

	
	function wsResp(wsResponse) {
		//console.info('ws resp', wsResponse);
		var dataRaw = wsResponse.data;
		var responseObject = JSON.parse(dataRaw.replace(/\0/g, ''));
		console.info('ws resp obj', responseObject);
	}

	//todo: add subscribers/rxSubjects to server events
	
	//todo: add onClose handler

});