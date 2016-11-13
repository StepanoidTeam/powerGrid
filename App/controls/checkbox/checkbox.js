'use strict';

var componentController = function () {
	var ctrl = this;


	ctrl.iconChecked = ctrl.iconChecked || 'check_box';
	ctrl.iconUnchecked = ctrl.iconUnchecked || 'check_box_outline_blank';
};

angular.module('app')
	.component('checkbox', {
		bindings: {
			value: '<',

			isChecked: '<',
			isDisabled: '<',

			iconChecked: '@',
			iconUnchecked:'@',

			onClick: '&',
		},
		templateUrl: 'app/controls/checkbox/checkbox.html',
		controller: componentController
	});