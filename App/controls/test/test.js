'use strict';

var componentController = function () {
    var ctrl = this;
    
};

angular.module('powerGrid')
    .component('pgTestComponent', {
        bindings: {
            text: '<'
        },
        templateUrl: 'app/controls/test/test.html',
        controller: componentController
    });