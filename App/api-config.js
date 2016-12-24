'use strict';

angular.module('app')
.constant('apiConfig', {

	apiUrl : 'http://localhost:5000/api/',
	wsUrl: 'ws://localhost:5000',

	//apiUrl: 'http://pg-api.azurewebsites.net/api/',
	//wsUrl: 'ws://pg-api.azurewebsites.net/api',
});
