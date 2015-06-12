'use strict';

angular.module('prodapps')
.controller('AssemblyCtrl', function ($scope, $state, jsonRpc, prodooSync, $notification, prodooPrint, $timeout, $ionicScrollDelegate) {
    $scope.sync = { data: null, current: { filter: { 'state':'!done'}}};
    var destroy = prodooSync.syncData({workcenter: $state.params.workcenter}, $scope.sync);
    $scope.fields = [];
    $scope.scans = [];
    $scope.casier = [];
    $scope.locks = [];

    $scope.$watch('sync.current.item', function (newVal) {
        if (!newVal)
            return;

        $scope.fields = newVal.components;

        if (!newVal.casiers)
          newVal.casiers = [];

        if (!newVal.scans) {
          newVal.scans = [];
          //if item.components is [ {name: 'tissu'}, { name:'profile'}]
          // and item.qty = 2
          // then scans whould be [ [null, null], [null, null]]
          // (Array.prototype.fill() is not ready yet / polyfill instead :

          var line = [], k = 0, l = 0;
          for (k = 0; k < newVal.qty; k++) {
            line = [];
            for (l = 0; l < newVal.components.length; l++) {
              line.push(null);
            }
            newVal.scans.push(line);
            $scope.locks.push(true);
          }
        }

    });

    $scope.clickTask = function (item) {
      //set to current
      $scope.sync.current.item = item;

      //erase the search
      delete ($scope.sync.current.filter.lot_number);
    
      //scroll to item
      $timeout(function () {
        var offset =  angular.element('#item'+item.id)[0].offsetTop; //can be put in directive
        $ionicScrollDelegate.$getByHandle('handleScroll').scrollTo(0, offset, true);
        //anchorScroll doesn't work well
      },50); //wait dom update
    };

    $scope.setFilter = function (status) {
      if (status === 'toDo')
        $scope.sync.current.filter={state:'!done'};
      if (status === 'done')
        $scope.sync.current.filter={state:'done'};
      if (status === 'eraseSearch')
        delete ($scope.sync.current.filter.lot_number);

      $ionicScrollDelegate.$getByHandle('handleScroll').scrollTop();
    };

    $scope.do = function(item) {
        $scope.markAsDone(item);
    };

    $scope.markAsDone = function (item) {
        jsonRpc.call('mrp.production.workcenter.line', 'prodoo_action_done', [item.id, $scope.casier.join(';')]).then(function () {
            item.state = 'done';
            $notification('Done');
        }, function () {
            $notification('an error has occured');
        });
    };

    $scope.print = function (item, qte) {
        $notification('Printing...');
        prodooPrint(item, qte);
    };

    $scope.$on('$destroy', destroy);

});
