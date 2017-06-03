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


		svc.glob = 1;

		svc.close = function () {
			console.log('glob', svc.glob);
		};


		const wsSend = new Rx.Subject();
		//init
		svc.open = function () {
			const webSocket = new WebSocket(apiConfig.wsUrl);

			Rx.Observable.fromEvent(webSocket, 'open').map(wsEventMapper).subscribe(wsMsg => wsIsOpen.next(true));
			Rx.Observable.fromEvent(webSocket, 'close').map(wsEventMapper).subscribe(wsMsg => wsIsOpen.next(false));
			Rx.Observable.fromEvent(webSocket, 'message').map(wsEventMapper).subscribe(wsMsg => wsMessage.next(wsMsg));


			svc.glob = svc.glob + 1;

			svc.close = function () {
				if (webSocket) {
					webSocket.close();
				}
			};

			wsIsOpen.switchMap(isOpen => isOpen ? wsSend : Rx.Observable.never())
				.map(JSON.stringify)
				.subscribe(msg => webSocket.send(msg));

			return new Promise(resolve => {
				wsIsOpen.subscribe(x => resolve());
			});
		};

		svc.send = function (wsMethod, wsData = {}) {
			wsData.AuthToken = tokenService.getToken();
			wsData.Type = wsMethod;

			wsSend.next(wsData);
		};


		svc.reopen = async function () {
			await svc.close();
			await svc.open();
		}
	});

