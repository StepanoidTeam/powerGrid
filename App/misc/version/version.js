'use strict';

var componentController = function ($http, apiConfig) {
	var ctrl = this;


	//todo: move to manager/service

	var apiVerUrl = apiConfig.apiUrl + 'version';

	$http.get(apiVerUrl).then(function (data) {
		ctrl.value = data.data.data;
		console.info('server responds ok', data);
	}, function (data) {
		ctrl.value = 'FAILED TO LOAD VERSION';
		console.warn('server responds bad', data);
	});

	ctrl.value = 'loading...';
};

angular.module('app')
    .component('version', {
    	bindings: {
    	},
    	templateUrl: 'app/misc/version/version.html',
    	controller: componentController
    });