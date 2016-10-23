angular.module('app')
.service('versionService', function ($http, apiConfig) {

	var svc = this;

	svc.getApiVersion = function () {
		var url = apiConfig.apiUrl + 'version';

		return $http.get(url);
	};

});
