angular.module('app')
	.service('versionService', function ($location, apiEndpoints) {
		const svc = this;

		svc.getApiVersion = function () {
			return apiEndpoints.getVersion().catch((error) => {
				console.error(error);
				$location.path('/error', error);
				throw error;
			});
		};

	});
