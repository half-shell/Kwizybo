var app = angular.module('lectorQuizz.services', []);
app.factory('loginService',function($http,$q, $location, sessionService){
	return{
		login:function(data,scope){
			var defer = $q.defer();
			var promise = $http.post('php/user_session.php',data); //send data to user.php
			promise.then(function(msg){

				var uid = msg.data.uid;
				if(uid){
					//scope.msgtxt='Correct information';
					var data_user = msg.data;
					sessionService.set('uid',uid);
					sessionService.set('id-user',data_user.id_user);
					defer.resolve(data_user);
				}	       
				else  {
					defer.reject(msg.data);
					$location.path('/Connexion');
				}				   
			});
			return defer.promise;
		},
		logout:function(){
			sessionService.destroy('id-user');
			sessionService.destroy('uid');
			$location.path('/Connexion');
		},
		islogged:function(){
			var $checkSessionServer=$http.post('php/check_session.php');
			return $checkSessionServer;
		}
	}

});

app.factory('gameService',function($http,$q, $location, sessionService){
	return{
		get_playing_games:function(id_user){
			var defer = $q.defer();
			var promise = $http.post('./php/get_games.php',{'id': id_user}); //send data to user.php
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		new_game:function(id_user,pseudo){
			var defer = $q.defer();
			var promise = $http.post('./php/add_new_game.php',{'id': id_user,'pseudo': pseudo}); //send data to user.php
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		new_turn:function(data){
			var defer = $q.defer();
			var promise = $http.post('./php/update_turn_game.php',{'id': data.id_game,'round': data.round,'current_player': data.current_player,'is_finished': data.is_finished}); //send data to user.php
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		get_current_game:function(id_game){
			var defer = $q.defer();
			var promise = $http.post('./php/get_current_game.php',{'id': id_game}); //send data to user.php
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		update_current_game:function(data){
			var defer = $q.defer();
			var promise = $http.post('./php/update_game.php',{'id': data.id_game,'score_1': data.score_1,'score_2': data.score_2, 'round': data.round,'current_player': data.current_player,'is_finished': data.is_finished}); //send data to user.php
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
	}
});
app.factory('gameStoryService',function($http,$q, $location, sessionService){
	return{
		get_finished_games:function(id_user){
			var defer = $q.defer();
			var promise = $http.post('./php/get_finished_games.php',{'id': id_user}); //send data to user.php
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		}
	}
});

app.factory('sessionService', ['$http', function($http){
	return{
		set:function(key,value){
			return sessionStorage.setItem(key,value);
		},
		get:function(key){
			return sessionStorage.getItem(key);
		},
		destroy:function(key){
			$http.post('php/destroy_session.php');
			return sessionStorage.removeItem(key);
		}
	};
}]);