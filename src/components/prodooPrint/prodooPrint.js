'use strict';

angular.module('prodapps').provider('prodooPrint',[ function prodooPrintProvider() {

	this.$get = ['$http', 'prodooConfig', function ($http, prodooConfig) {
			return function (payload, qte) {
				var req = {
					args: ['label', payload.label],
					kwargs: { options : { 'copies': (qte) ? qte : payload.quantities }}
				};
				$http.post(prodooConfig.printServer+'/cups/printData', req);
				console.log('print !!!!', payload);
			};
	}];

	return this;
}])
