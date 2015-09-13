angular
  .module('lectorQuizz.controllers')
    .controller('RejectedQuestions', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_rejected_questions.php',{
      'id_user': $scope.current_user.id_user
    }).
      success(function(data){
        $scope.recjected_questions = data;
        $scope.rejected_count = data.length;
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
  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
    };
  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes = data;
      });

  $scope.is_questions = function(){
    if($scope.recjected_questions){
      return $scope.recjected_questions.length;
    }else{
      return 0;
    }
  };
  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
    };

  $scope.validation = function(question) {
    $http.post('./php/update_rejected_question.php',{
          'id': question.id_question,
          'value': question.value_question,
          'theme_id': question.theme_id,
          'good_rep': question.good_rep,
          'bad_rep1': question.bad_rep1,
          'bad_rep2': question.bad_rep2,
          'bad_rep3': question.bad_rep3}
      ).
      success(function(){
        load_scope();
      });
    };
  load_scope();
}]);