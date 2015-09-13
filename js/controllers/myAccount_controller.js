angular
  .module('lectorQuizz.controllers')
    .controller('MyAccount', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;

  $scope.change_username = function(user){
    $scope.infos = false;
    $scope.bad_infos = false;
    if(user){
      $http.post('./php/update_username.php',{
          'id': $scope.current_user.id_user,
          'pseudo': user.pseudo
        }
      ).
      success(function(msg){
        if(msg.success == true){
          $scope.infos = true;
          $scope.bad_infos = false;
          $scope.msg = "Changement de pseudo éffectué avec succès.";
        }else{
          $scope.infos = true;
          $scope.bad_infos = true;
          $scope.msg = msg;
        };
      });
    }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = "Veuillez choisir un nouveau pseudo.";
    };
  };

  $scope.change_password = function(user){
    $scope.infos = false;
    $scope.bad_infos = false;
    if(user){
      if(CryptoJS.MD5(user.old_pass) == $scope.current_user.password){
        if(user.new_pass == user.new_pass_conf){
          $http.post('./php/update_pass_user.php',{
                'id': $scope.current_user.id_user,
                'password': user.new_pass
              }
            ).
            success(function(){
              $scope.infos = true;
              $scope.bad_infos = false;
              $scope.msg = "Changement de mot de passe avec succès.";
            });
        }else{
          $scope.infos = true;
          $scope.bad_infos = true;
          $scope.msg = "La confirmation du mot de passe ne correspond pas.";
        };
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = "L'ancien mot de passe ne correspond pas.";
      };
    }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = "Tous les champs ne sont pas remplis.";
    };
  };
}]);