'use strict';

var componentController = function ($q, authService) {
	var ctrl = this;

	ctrl.isAuthorized = false;


	$q.all([authService.isAuthorized(), authService.getPlayerStatus()]).then(function (results) {
		var player = results[1];

		ctrl.userName = player.Name;
		ctrl.isAuthorized = true;
	}).catch(function () {
		ctrl.isAuthorized = false;
	});

};

angular.module('auth')
	.component('currentUser', {
		bindings: {
		},
		templateUrl: 'app/auth/current-user/current-user.html',
		controller: componentController
	});