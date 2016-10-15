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

angular.module('app')


	.component('auth', {
		template: '<h2>AUTH</h2><ng-outlet></ng-outlet>',
		$routeConfig: [
		  { path: '/login', name: 'Login', component: 'login', useAsDefault: true },
		  //{path: '/:id', name: 'HeroDetail', component: 'heroDetail'}
		]
	})

    .component('login', {
    	bindings: {
    		//some login callbacks
    	},
    	templateUrl: 'app/auth/login/login.html',
    	controller: componentController
    })

;