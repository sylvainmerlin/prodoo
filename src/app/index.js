'use strict';

angular.module('prodapps', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'mgcrea.ngStrap','buche', 'odoo'])
  .config(function ($stateProvider, $urlRouterProvider, jsonRpcProvider, prodooConfigProvider) {
    $stateProvider
	.state('main', {
   	templateUrl: 'app/main/main.html'
	})
      .state('main.home', {
        url: '/',
	templateUrl: 'app/main/home.html',
        controller: 'MainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
	});
    $stateProvider.state('main.cut', {
        url: '/cut/{workcenter:int}',
        templateUrl: 'app/cut/cut.html',
        controller: 'CutCtrl'
    });

    $stateProvider.state('main.strip_cut', {
        url: '/stripCut/{workcenter:int}',
        templateUrl: 'app/stripCut/stripCut.html',
        controller: 'StripCutCtrl'
    });
    $stateProvider.state('main.assembly', {
      url:'/assembly/{workcenter:int}',
        templateUrl: 'app/assembly/assembly.html',
        controller:'AssemblyCtrl'
    });
    $stateProvider.state('main.venetianAssembly', {
      url:'/venetianAssembly/{workcenter:int}',
        templateUrl: 'app/venetianAssembly/venetianAssembly.html',
        controller:'VenetianAssemblyCtrl'
    });
    $stateProvider.state('main.carrierAssembly', {
      url:'/carrierAssembly/{workcenter:int}',
        templateUrl: 'app/carrierAssembly/carrierAssembly.html',
        controller:'CarrierAssemblyCtrl'
    });

   $urlRouterProvider.otherwise('/');

    jsonRpcProvider.odooRpc.odoo_server = prodooConfigProvider.config.server;
   jsonRpcProvider.odooRpc.interceptors.push(function (a) { console.log('Et BIM !!!', a);});

	})
.run(function ($rootScope, $state, jsonRpc, prodooConfig) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if (toState.name === 'login')
			return;

		if (!jsonRpc.isLoggedIn()) {
			console.log('not logged in');
			event.preventDefault();
			$state.go('login');
		}
	}); 

  })
;
