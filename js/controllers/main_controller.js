	angular
	  .module('lectorQuizz.controllers')
	    .controller('MainCtrl', ['$scope','$http','$location','$filter','loginService','gameService', function($scope,$http,$location,$filter,loginService,gameService){
	    	
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
	  		        $scope.setAdmin();
	  		      };
	  		      return $scope.current_user;
	  		    };
	  		  });
	  		};
	  		$scope.is_connected();

	  		$scope.setAdmin = function(){
	  		  $http.post('./php/get_unvalidate_questions.php',{
	  		    'quizz_id': $scope.current_user.quizz_id
	  		  }).
	  		      success(function(data) {
	  		        $scope.questions_to_validate = data.length;
	  		      });
	  		  $scope.admin = true;
	  		};

	  		$scope.dropdown_margin = 0;
	  		$scope.dropdown = false;
	  		$scope.admin = false;

	  		  // move to signIn_controller
	  		
			
	  		$scope.logout=function(){
	  		  loginService.logout();
	  		  $scope.admin = false;	
	  		  $scope.dropdown = false;
	  		  $scope.dropdown_margin = 0;
	  		  $scope.is_logged = false;
	  		  $scope.current_user = null;
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
	  		$scope.GetQuizz = function(id){
    
      	};	
      	$scope.GetNotifGames = function(id){
        	var toto = gameService.get_playing_games(id);
        	toto.then(function(data) {
        	    new_data = $filter('exact')(data,{current_player: id.toString()});
        	    $scope.notif = new_data.length;
        	  });
      	};
	}]);