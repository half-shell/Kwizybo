angular
	.module('lectorQuizz.services')
	.factory('gameService',function($http,$q, $location, sessionService){
	
	return{
		get_playing_games:function(id_user){
			var defer = $q.defer();
			var promise = $http.post('./php/get_games.php',{'id': id_user}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		new_game:function(id_user,pseudo,quizz_id){
			var defer = $q.defer();
			var promise = $http.post('./php/add_new_game.php',{'id': id_user,'pseudo': pseudo, 'quizz_id': quizz_id}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
    	new_specific_game:function(id_user,pseudo,quizz_id,pseudo_2){
			var defer = $q.defer();
			var promise = $http.post('./php/add_new_specific_game.php',{'id': id_user,'pseudo': pseudo, 'quizz_id': quizz_id, 'pseudo_2': pseudo_2}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		new_turn:function(data){
			var defer = $q.defer();
			var promise = $http.post('./php/update_turn_game.php',{'id': data.id_game,'round': data.round,'current_player': data.current_player,'is_finished': data.is_finished}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		get_current_game:function(id_game){
			var defer = $q.defer();
			var promise = $http.post('./php/get_current_game.php',{'id': id_game}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
		update_current_game:function(data){
			var defer = $q.defer();
			var promise = $http.post('./php/update_game.php',{'id': data.id_game,'score_1': data.score_1,'score_2': data.score_2, 'round': data.round,'current_player': data.current_player,'is_finished': data.is_finished}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		},
	}
});