angular.module('app')
	.service('tokenService', function ($cookies) {
		const svc = this;

		const tokenCookieKey = 'AuthToken';

		svc.tokenExists = function () {
			return svc.getToken() !== undefined;
		};

		svc.getToken = function () {
			return $cookies.getObject(tokenCookieKey);
		};

		svc.mapToken = function (rawToken) {
			return rawToken[tokenCookieKey];
		};

		svc.saveToken = function (token) {
			$cookies.putObject(tokenCookieKey, token);
			return token;
		};

		svc.deleteToken = function () {
			$cookies.remove(tokenCookieKey);
			return Promise.resolve();
		};
	});
