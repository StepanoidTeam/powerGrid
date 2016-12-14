'use strict';

angular.module('app')
.service('apiWsEndpoints', function ($q, $http, tokenService, apiConfig) {
	var svc = this;

	//init
	var url = apiConfig.wsUrl;
	var webSocket = new WebSocket(url);
	webSocket.onmessage = wsResp;



	function wsRequest(data) {
		//var headers = { authToken: tokenService.getToken() };

		//todo: somehow add token to ws send if possible
		request = { AuthToken: tokenService.getToken(), Message: data };
		var dataJson = JSON.stringify(request);
		console.log(dataJson);
		webSocket.send(dataJson);
	}


	function wsResp(wsResponse) {
		console.info(wsResponse);
		var responseObject = JSON.parse(wsResponse.data);
		console.info(responseObject);
	}

	//todo: add subscribers/rxSubjects to server events
	
	//todo: add onClose handler

});