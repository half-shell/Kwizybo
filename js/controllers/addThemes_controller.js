angular
  .module('lectorQuizz.controllers')
    .controller('AddTheme', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_add = false;

   $http.get('./php/get_quizz.php').
    success(function(data) {
      $scope.quizz = data;
  });

  $scope.add_theme = function(data){
    if(data){
    $http.post('./php/add_themes.php',{
      'quizz_id': data.quizz_id,
      'name_theme': data.name_theme,
      'description_theme': data.description_theme
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.data = {};
        $scope.succes_add = true;
        $scope.bad_infos = false;
        $scope.msg = "Thème ajouté avec succès";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Tous les champs ne sont pas remplis";
  };
  };
}]);