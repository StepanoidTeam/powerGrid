'use strict';

var componentController = function () {
	var ctrl = this;


	this.$routerOnActivate = function (next) {
		//// Load up the heroes for this view
		//heroService.getHeroes().then(function (heroes) {
		//	$ctrl.heroes = heroes;
		//	selectedId = next.params.id;
		//});
		console.log(next);
	};
};
angular.module('auth')
    .component('login', {
    	bindings: {
    		//some login callbacks
    	},
    	templateUrl: 'app/auth/login/login.html',
    	controller: componentController
    })

;