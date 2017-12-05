angular.module('app')
	.service('pageStateService', function () {
		const svc = this;

		svc.rxIsVisible = Rx.Observable.fromEvent(document, 'visibilitychange').map(() => !document.hidden);
	});
