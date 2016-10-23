'use strict';

var componentController = function (authService) {
	var ctrl = this;

	ctrl.value = 'loading...1';

	authService.getCurrentUser().then(function (user) {
		ctrl.value = user.userId;
	}, function (err) {
		ctrl.value = 'unauthorized';

		//todo: navigate to login
	});
	
};

angular.module('app')
    .component('currentUser', {
    	bindings: { },
    	templateUrl: 'app/auth/current-user/current-user.html',
    	controller: componentController
    });