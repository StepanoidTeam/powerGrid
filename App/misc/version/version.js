'use strict';

var componentController = function ($http) {
	var ctrl = this;


    //todo: move to manager/service

    var apiVerUrl= 'http://powergrid-api.azurewebsites.net/api/Version';

    $http.get(apiVerUrl).then(function(data){
        ctrl.value = data;
        console.info('server responds ok',data);
    },function(data){
        ctrl.value = 'FAILED TO LOAD VERSION';
        console.warn('server responds bad',data);
    });


    ctrl.value = 'loading...';
};

angular.module('powerGrid')
    .component('version', {
    	bindings: {
    	},
    	templateUrl: 'app/misc/version/version.html',
    	controller: componentController
    });