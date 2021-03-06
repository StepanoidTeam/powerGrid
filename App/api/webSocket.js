'use strict';

angular.module('app')
	.service('webSocket', function (apiConfig, tokenService) {
		const svc = this;

		//private
		const wsMessage = new Rx.Subject();
		const wsIsOpen = new Rx.Subject();

		//public
		svc.wsMessage = Rx.Observable.from(wsMessage);

		function wsEventMapper(wsEvent) {
			const dataRaw = wsEvent.data;
			//todo: dirty hack - remove
			return JSON.parse(dataRaw || "{}");
		}

		let wsSend = new Rx.Subject();
		//init
		svc.open = function () {

			const webSocketInstance = new WebSocket(apiConfig.wsUrl);

			Rx.Observable.fromEvent(webSocketInstance, 'open').map(wsEventMapper).subscribe(wsMsg => wsIsOpen.next(true));
			Rx.Observable.fromEvent(webSocketInstance, 'close').map(wsEventMapper).subscribe(wsMsg => wsIsOpen.next(false));
			Rx.Observable.fromEvent(webSocketInstance, 'message').map(wsEventMapper).subscribe(wsMsg => wsMessage.next(wsMsg));

			svc.close = function () {
				if (webSocketInstance) {
					webSocketInstance.close();
					console.log('ws clozed👿');
				}
				wsSend.complete();

				wsSend = new Rx.Subject();
				wsIsOpen.unsubscribe();
			};

			wsIsOpen.switchMap(isOpen => isOpen ? wsSend : Rx.Observable.never())
				.map(JSON.stringify)
				.subscribe(msg => webSocketInstance.send(msg));

			return new Promise(resolve => {
				wsIsOpen.subscribe(x => resolve());
			});
		};

		svc.send = function (wsMethod, wsData = {}) {
			wsData.AuthToken = tokenService.getToken();
			wsData.Type = wsMethod;

			wsSend.next(wsData);
		};
	});

