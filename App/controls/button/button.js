'use strict';

var componentController = function () {
	var ctrl = this;
};

angular.module('app')
    .component('pgButton', {
    	bindings: {
    		value: '<',
			icon:'<',

			isDisabled:'<',
			
			onClick: '&',
    	},
    	templateUrl: 'app/controls/button/button.html',
    	controller: componentController
    });