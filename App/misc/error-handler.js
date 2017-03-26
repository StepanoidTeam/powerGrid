angular.module('app')
	.constant('errorHandler', function (error) {
		console.warn(error.message);
		return error;
	});



// window.errorHandler = function (error) {
// 	console.error(error.message);
// 	return error;
// };
