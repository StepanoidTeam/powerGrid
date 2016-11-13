'use strict';

var componentController = function (versionService) {
	var ctrl = this;

	ctrl.value = 'loading...';

	versionService.getApiVersion()
	.then(function (value) {
		ctrl.value = value;
	}, function (error) {
		ctrl.value = 'FAILED TO LOAD VERSION';
		console.error(error);
	});


};

angular.module('app')
	.component('version', {
		bindings: {
		},
		templateUrl: 'app/misc/version/version.html',
		controller: componentController
	});