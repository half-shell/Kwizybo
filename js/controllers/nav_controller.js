angular
  .module('lectorQuizz.controllers')
    .controller('Navigation', ['$scope','$http','$location','$filter','loginService','gameService', function($scope,$http,$location,$filter,loginService,gameService){
      $scope.is_connected();
      console.log($scope.current_user);
      $scope.play_button = function(){
        $location.path("/Game");
      };
    
      $scope.active = function(path) {
        return path === $location.path();
      };
}]);