angular
  .module('lectorQuizz.controllers')
    .controller('SignUp', ['$scope','$http', function($scope,$http){
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_1 = false;

  $scope.add_user = function(data){
    if(data){
    $scope.pseudo_tmp = data.pseudo;
    $http.post('./php/add_user.php',{
      'pseudo': data.pseudo,
      'password': data.password,
      'password_confirmation': data.password_confirmation
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.success_1 = true;
        $scope.bad_infos = false;
        $scope.data = {};
        $scope.msg = "Inscription Réussie";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez remplir tous les champs";
  };
  };

  $scope.add_quizz_code = function(data){
    if(data){
    $http.post('./php/add_user_quizz.php',{
      'code_quizz': data.code_quizz,
      'pseudo': $scope.pseudo_tmp
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.success_2 = true;
        $scope.bad_infos = false;
        $scope.data = {};
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
    $scope.msg = "Veuillez remplir tous les champs";
  };
  };
}]);