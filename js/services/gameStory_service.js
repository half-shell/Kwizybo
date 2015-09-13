angular
	.module('lectorQuizz.services')
	.factory('gameStoryService',function($http,$q, $location, sessionService){
	
	return{
		get_finished_games:function(id_user){
			var defer = $q.defer();
			var promise = $http.post('./php/get_finished_games.php',{'id': id_user}); 
			promise.then(function(msg){
				defer.resolve(msg.data);
			});
			return defer.promise;
		}
	}
});