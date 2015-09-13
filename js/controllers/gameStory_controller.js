angular
  .module('lectorQuizz.controllers')
    .controller('GameStory', ['$scope', '$http','gameStoryService', function($scope,$http,gameStoryService) {
  $scope.is_connected();
    $scope.GetFinishedGames = function(id){
    var toto = gameStoryService.get_finished_games(id);
      toto.then(function(data) {
        $scope.finished_games = data;
        $scope.len_finish = $scope.finished_games.length;
        $scope.finished_games.forEach(function(entry){
          if(entry.score_1 > entry.score_2){
            entry.winner_id = entry.user_id_1;
          }else if(entry.score_1 < entry.score_2){
            entry.winner_id = entry.user_id_2;
          }else{
            entry.winner_id = "none";
          };
        });
      });
    };
    if($scope.is_logged) $scope.GetFinishedGames($scope.current_user.id_user);
}]);