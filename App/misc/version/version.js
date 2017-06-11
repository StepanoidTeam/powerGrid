'use strict';

var componentController = function ($location, versionService) {
	const ctrl = this;

	ctrl.version = 'loading...';
	ctrl.buildDt = '-';

	versionService.getApiVersion()
		.then(function (value) {
			ctrl.version = value.version;
			ctrl.buildDt = value.buildDt;

			ctrl.lastModified = new Date(document.lastModified);

			document.body.dataset.online = true;
		})
		.catch(function (error) {
			ctrl.version = 'FAILED TO LOAD VERSION';
			ctrl.buildDt = '✖️';
			$location.path('/error');
		});


};

angular.module('app')
	.component('version', {
		bindings: {},
		templateUrl: 'app/misc/version/version.html',
		controller: componentController
	});
