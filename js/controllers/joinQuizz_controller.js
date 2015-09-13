angular
  .module('lectorQuizz.controllers')
    .controller('JoinQuizz', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes = false;

   $scope.add_quizz_code = function(data){
    if(data){
    $http.post('./php/add_user_quizz.php',{
      'code_quizz': data.code_quizz,
      'pseudo': $scope.current_user.pseudo
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.success = true;
        $scope.bad_infos = false;
        $scope.msg = "Inscription au quizz réussie.";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez entrer un code";
  };
  };
}]);