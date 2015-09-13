angular
  .module('lectorQuizz.controllers')
    .controller('Ladder', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_ladder.php',{
      'quizz_id': $scope.current_user.quizz_id
    }).
      success(function(data) {
        $scope.users = data;
      });
  };
  load_scope();
}]);
