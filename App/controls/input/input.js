'use strict';

var componentController = function () {
	var ctrl = this;
};

angular.module('powerGrid')
    .component('pgInput', {
    	bindings: {
    		value: '<',
            
            isDisabled:'<',
            
            onChange:'&',
            onBlur:'&',
    	},
    	templateUrl: 'app/controls/input/input.html',
    	controller: componentController
    });