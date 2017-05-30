'use strict';

var componentController = function (versionService) {
	const ctrl = this;

	ctrl.version = 'loading...';
	ctrl.buildDt = '-';

	versionService.getApiVersion()
		.then(function (value) {
			ctrl.version = value.version;
			ctrl.buildDt = value.buildDt;

			document.body.dataset.online = true;
		}, function (error) {
			ctrl.version = 'FAILED TO LOAD VERSION';
			console.error(error);
		});


};

angular.module('app')
	.component('version', {
		bindings: {},
		templateUrl: 'app/misc/version/version.html',
		controller: componentController
	});
