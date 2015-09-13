angular
  .module('lectorQuizz.controllers')
    .controller('AddQuestions', ['$scope', '$http', function($scope,$http) {
  $scope.is_connected();

  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes = data;
      });

  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_add = false;

  $scope.add_question = function(data){
    if(data){
    $http.post('./php/add_question.php',{
      'theme_id': data.theme_id,
      'value': data.value,
      'good_rep': data.good_rep,
      'bad_rep1': data.bad_rep1,
      'bad_rep2': data.bad_rep2,
      'bad_rep3': data.bad_rep3
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.data = {};
        $scope.succes_add = true;
        $scope.bad_infos = false;
        $scope.msg = "Question proposée avec succès";
      }else{
        $scope.infos = true;
        $scope.succes_add = false;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.succes_add = false;
    $scope.bad_infos = true;
    $scope.msg = "Tous les champs ne sont pas remplis";
  };
  };
}]);