angular
  .module('lectorQuizz.controllers')
    .controller('SetThemes', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope_theme = function(){
    $http.get('./php/get_setting_theme.php').
      success(function(data) {
        $scope.themes = data;
      });
  };

  $http.get('./php/get_quizz.php').
    success(function(data) {
      $scope.quizz = data;
  });


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


  $scope.validation = function(theme) {
    $http.post('./php/update_themes.php',{
          'id': theme.id_theme,
          'name_theme': theme.name_theme,
          'description_theme': theme.description_theme,
          'playable': theme.playable
      }).
      success(function(){
        $scope.infos = true;
        $scope.updated_theme_name = theme.name_theme;
        load_scope_theme();
      });
    };
  load_scope_theme();
}]);