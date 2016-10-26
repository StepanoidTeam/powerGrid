function CrisisService($q) {
	var crisesPromise = $q.when([
	  { id: 1, name: 'Princess Held Captive' },
	  { id: 2, name: 'Dragon Burning Cities' },
	  { id: 3, name: 'Giant Asteroid Heading For Earth' },
	  { id: 4, name: 'Release Deadline Looms' }
	]);

	this.getCrises = function () {
		return crisesPromise;
	};

	this.getCrisis = function (id) {
		return crisesPromise.then(function (crises) {
			for (var i = 0; i < crises.length; i++) {
				if (crises[i].id === id) return crises[i];
			}
		});
	};
}

function CrisisListComponent(crisisService) {
	var selectedId = null;
	var ctrl = this;

	this.$routerOnActivate = function (next) {
		//console.log('$routerOnActivate', this, arguments);
		// Load up the crises for this view
		crisisService.getCrises().then(function (crises) {
			ctrl.crises = crises;
			selectedId = next.params.id;
		});
	};

	this.isSelected = function (crisis) {
		return (crisis.id === selectedId);
	};

	this.onSelect = function (crisis) {
		this.$router.navigate(['CrisisDetail', { id: crisis.id }]);
	};
}

function CrisisDetailComponent(crisisService) {
	var ctrl = this;
	this.$routerOnActivate = function (next) {
		// Get the crisis identified by the route parameter
		var id = next.params.id;
		crisisService.getCrisis(id).then(function (crisis) {
			if (crisis) {
				ctrl.editName = crisis.name;
				ctrl.crisis = crisis;
			} else { // id not found
				ctrl.gotoCrises();
			}
		});
	};


	this.cancel = function () {
		ctrl.editName = ctrl.crisis.name;
		ctrl.gotoCrises();
	};

	this.save = function () {
		ctrl.crisis.name = ctrl.editName;
		ctrl.gotoCrises();
	};

	this.gotoCrises = function () {
		var crisisId = ctrl.crisis && ctrl.crisis.id;
		// Pass along the hero id if available
		// so that the CrisisListComponent can select that hero.
		this.$router.navigate(['CrisisList', { id: crisisId }]);
	};
}