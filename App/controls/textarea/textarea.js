'use strict';

var componentController = function () {
	var ctrl = this;
};

angular.module('app')
    .component('pgTextarea', {
    	bindings: {
    		value: '<',

    		isDisabled: '<',

    		onChange: '&',
    		onBlur: '&',
    	},
    	templateUrl: 'app/controls/textarea/textarea.html',
    	controller: componentController
    });
