angular
	.module('lectorQuizz.services')
	.factory('loginService',function($http,$q, $location, sessionService){
		
	return{
		login:function(data,scope){
			var defer = $q.defer();
			var promise = $http.post('php/user_session.php',data); 
			promise.then(function(msg){

				var uid = msg.data.uid;
				if(uid){
					//scope.msgtxt='Correct information';
					var data_user = msg.data;
					sessionService.set('uid',uid);
					// sessionService.set('id-user',data_user.id_user);
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
			// sessionService.destroy('id-user');
			sessionService.destroy('uid');
			$location.path('/Connexion');
		},
		islogged:function(){
			var $checkSessionServer=$http.post('php/check_session.php');
			return $checkSessionServer;
		}
	}

});
