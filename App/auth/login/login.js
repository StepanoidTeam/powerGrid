'use strict';

var componentController = function () {
	var ctrl = this;

};

angular.module('app')
    .component('login', {
    	bindings: {
    		//some login callbacks
    	},
    	templateUrl: 'app/auth/login/login.html',
    	controller: componentController
    });