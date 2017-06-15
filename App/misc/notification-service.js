angular.module('app')
	.service('notificationService', function () {
		const svc = this;

		const defaultIcon = 'Assets/images/pg-icon-black.png';

		function initNotifications() {
			if (Notification.permission === 'default') {
				Notification.requestPermission(function (permission) {
					if (permission === "granted") {
						svc.showNotification('hi');
					}
				});
			}
		}

		initNotifications();

		svc.showNotification = function (title, body, tag, icon = defaultIcon) {
			return new Notification(title, {body, tag, icon});
		};
	});


