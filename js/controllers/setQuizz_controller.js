angular
  .module('lectorQuizz.controllers')
    .controller('SetQuizz', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.get('./php/get_quizz.php').
      success(function(data) {
        $scope.quizz = data;
      });
  };

  $scope.validation = function(quizz) {
    $http.post('./php/update_quizz.php',{
          'id': quizz.id_quizz,
          'name_quizz': quizz.name_quizz
        }
      ).
      success(function(){
        load_scope();
        $scope.infos = true;
        $scope.updated_quizz_name = quizz.name_quizz;
      });
    };
  load_scope();
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
}]);