'use strict';

var componentController = function (versionService) {
	const ctrl = this;

	ctrl.version = 'loading...';
	ctrl.publishedDt = '-';

	versionService.getApiVersion()
	.then(function (value) {
		ctrl.version = value.version;
		ctrl.publishedDt = value.publishedDt;
		console.log(value);
	}, function (error) {
		ctrl.version = 'FAILED TO LOAD VERSION';
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
