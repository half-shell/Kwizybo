angular
  .module('lectorQuizz.controllers')
    .controller('AddQuizz', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_add = false;

  $scope.add_quizz = function(data){
    if(data){
    $http.post('./php/add_quizz.php',{
      'name_quizz': data.name_quizz
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.succes_add = true;
        $scope.bad_infos = false;
        $scope.data = {};
        $scope.msg = "Quizz ajouté avec succès. Celui-ci a pour CODE : ";
        $scope.quizz_code = msg.code_quizz;
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez entrer un nom pour le quizz";
  };
  };
}]);