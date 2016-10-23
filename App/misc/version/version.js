'use strict';

var componentController = function (versionService) {
	var ctrl = this;

	versionService.getApiVersion().then(function (data) {
		ctrl.value = data.data.data;
	}, function (data) {
		ctrl.value = 'FAILED TO LOAD VERSION';
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