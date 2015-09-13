angular
  .module('lectorQuizz.controllers')
    .controller('Acceuil', ['$scope','loginService', function ($scope,loginService) {
  $scope.is_connected();
}]);