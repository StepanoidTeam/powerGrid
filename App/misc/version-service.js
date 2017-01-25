angular.module('app')
.service('versionService', function ($location, apiEndpoints) {
	var svc = this;

	svc.getApiVersion = function () {
		return apiEndpoints.getVersion();
	};

});
