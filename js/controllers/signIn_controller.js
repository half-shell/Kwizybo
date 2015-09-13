angular
  .module('lectorQuizz.controllers')
    .controller('SignIn', ['$scope','$http','$location','$filter','loginService','gameService', function($scope,$http,$location,$filter,loginService,gameService){
	    $scope.is_connected();
	    $scope.bad_infos = false;
	  	$scope.is_logged = false;

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
	  	      $scope.setAdmin();
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
}]);