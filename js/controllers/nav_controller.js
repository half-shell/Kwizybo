angular
  .module('lectorQuizz.controllers')
    .controller('Navigation', ['$scope','$http','$location','$filter','loginService','gameService', function($scope,$http,$location,$filter,loginService,gameService){
  
  $scope.play_button = function(){
    $location.path("/Game");
  };

  $scope.login=function(data){
    var toto = loginService.login(data);
    toto.then(function(msg){
      $scope.current_user = msg;
      $scope.dropdown_margin = 2;
      $scope.dropdown = true;
      $location.path("/Home");
      $scope.GetQuizz($scope.current_user.id_user);
      $scope.GetNotifGames($scope.current_user.id_user);
      if($scope.current_user.admin == '1'){
        setAdmin();
      }
    },function(reason){
      $scope.reason_bad = reason;
      if($scope.reason_bad == "Mot de passe incorrect"){
        $scope.bad_login = false;
      }else{
        $scope.bad_login = true;
      };
      $scope.bad_infos = true;
    }); //call login service
  };

  $scope.current_user = false;
  $scope.is_connected = function(){
    var connected=loginService.islogged();
    connected.then(function(msg){
      if(msg.data != 'not logged'){
        $scope.current_user = msg.data;
        $scope.is_logged = true;
        $scope.GetQuizz($scope.current_user.id_user);
        $scope.GetNotifGames($scope.current_user.id_user);
        if($scope.current_user.admin == '1'){
          setAdmin();
        };
      };
    });
  };
  $scope.is_connected();

  $scope.logout=function(){
    loginService.logout();
    $scope.admin = false;
    $scope.dropdown = false;
    $scope.dropdown_margin = 0;
    $scope.is_logged = false;
    $scope.current_user = null;
  };
  $scope.bad_infos = false;
  $scope.is_logged = false;


  setAdmin = function(){
    $http.post('./php/get_unvalidate_questions.php',{
      'quizz_id': $scope.current_user.quizz_id
    }).
        success(function(data) {
          $scope.questions_to_validate = data.length;
        });
    $scope.admin = true;
  };

  $scope.active = function(path) {
    return path === $location.path();
  };

  $scope.changeDropdown = function(){
    if ($scope.dropdown == true) {
        $scope.dropdown_margin = 0;
        $scope.dropdown = false;
    }else{
      $scope.dropdown = true;
      $scope.dropdown_margin = 2;
    };
  };

  $scope.dropdown_margin = 0;
  $scope.dropdown = false;
  $scope.admin = false;

  $scope.GetNotifGames = function(id){
    var toto = gameService.get_playing_games(id);
    toto.then(function(data) {
        new_data = $filter('exact')(data,{current_player: id.toString()});
        $scope.notif = new_data.length;
      });
  };

  $scope.GetQuizz = function(id){

  };
}]);