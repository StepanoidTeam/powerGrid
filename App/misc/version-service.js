angular.module('app')
.service('versionService', function (apiEndpoints) {
	var svc = this;

	svc.getApiVersion = function () {
		return apiEndpoints.getVersion();
	};

});
