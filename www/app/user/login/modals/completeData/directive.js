angular.module('app').directive('completeModal', completeModal);

function completeModal(){
    return{
        template: '<a ng-click="ctrl.openModal()"></a>',
        controller: completeModalDirectiveController,
        controllerAs: 'ctrl',
        restrict: 'E',
        replace: true
    };
}

function completeModalDirectiveController($uibModal, $scope){
    this.openModal = function(){
        var modal = $uibModal.open({
            animation: true,
            scope: $scope,
            bindToController: true,
            templateUrl: 'app/user/login/modals/completeData/index.html',
            controller: 'completeModalController',
            controllerAs: 'vm',
            size: 'sm'
        });
    };
}
