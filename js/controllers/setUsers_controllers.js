angular
  .module('lectorQuizz.controllers')
    .controller('SetUsers', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_users.php',{
      'quizz_id': $scope.current_user.quizz_id
    }).
      success(function(data) {
        $scope.users = data;
      });
  };
    $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    };
  };

  $scope.validation = function(users){
    $http.post('./php/update_pass_user.php',{
          'id': users.id_user,
          'password': '1234'
        }
      ).
      success(function(){
        load_scope();
        $scope.infos = true;
        $scope.updated_user_pseudo = users.pseudo;
      });
    };
  load_scope();
}]);