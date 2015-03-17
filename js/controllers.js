var app = angular.module('lectorQuizz.controllers', []);

app.controller('Acceuil', ['$scope','loginService', function ($scope,loginService) {
  $scope.is_connected();
}]);

app.controller('Navigation', ['$scope','$http','$location','$filter','loginService','gameService', function($scope,$http,$location,$filter,loginService,gameService){
  $scope.login=function(data){
    var toto = loginService.login(data);
    toto.then(function(msg){
      $scope.current_user = msg;
      $location.path("/Home");
      $scope.GetNotifGames($scope.current_user.id_user);
      if($scope.current_user.admin == '1'){
        setAdmin();
      }
    },function(reason){
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
    $scope.admin_margin = 0;
    $scope.is_logged = false;
    $scope.current_user = null;
  };

  $scope.is_logged = false;


  setAdmin = function(){
    $http.get('./php/get_unvalidate_questions.php').
        success(function(data) {
          $scope.questions_to_validate = data.length;
        });
    $scope.admin = true;
    $scope.admin_margin = 1;
  };

  $scope.active = function(path) {
    return path === $location.path();
  };
  
  $scope.admin = false;
  $scope.admin_margin = 0;

  $scope.GetNotifGames = function(id){
    var toto = gameService.get_playing_games(id);
    toto.then(function(data) {
        new_data = $filter('filter')(data,{current_player: id.toString()});
        $scope.notif = new_data.length;
      });
  };
  

}]);

app.controller('Parties', ['$scope', '$http','$filter','gameService', function($scope,$http,$filter,gameService) {
  total_round = 3;
  $scope.round = 0;
  $scope.score = 0;
  $scope.savedScore = [];
  $scope.sevedFalseRep = [];
  $scope.launched = false;
  $scope.viewTheme = false;
  $scope.questions = [];

  $http.get('./php/get_themes.php').
      success(function(data) {
        $scope.themes = data;
      });

  $http.get('./php/get_questions.php').
      success(function(data) {
          // here the data from the api is assigned to a variable named users
          for (var i = 0 ; i < data.length; i++) {
            $scope.questions.push({
              id: data[i].id_question, 
              theme_id: data[i].theme_id,
              name_theme:  data[i].name_theme,
              value: data[i].value_question, 
              reponses:[
                {name: data[i].good_rep, valid: true,},
                {name: data[i].bad_rep1, valid: false,},
                {name: data[i].bad_rep2, valid: false,},
                {name: data[i].bad_rep3, valid: false,},
              ]
            })
          };
      });
        console.log($scope.questions);
  

  ThemeRandom = function(){
    $scope.randThemes = [];
    for (var i = 0; i < 2; i++ ){
      randt = Math.floor((Math.random() * $scope.themes.length));
      if($.inArray($scope.themes[randt],$scope.randThemes)){
        $scope.randThemes.push($scope.themes[randt]);
      }else{
        i-- ;
      }
    }
  }

  themeQuestions = function(theme_id) {
    $scope.questionsThemed = [];
    for (var i = 0 ; i < $scope.questions.length; i++)
      if($scope.questions[i].theme_id == theme_id){
        $scope.questionsThemed.push($scope.questions[i]);
      }
    return $scope.questionsThemed;
  };

  playQuestion = function(theme_id){
    titi = themeQuestions(theme_id);
    rand = Math.floor((Math.random() * titi.length));
    $scope.playings = [$scope.questionsThemed[rand]];
    for(var i = 0 ; i < $scope.playings[0].reponses.length; i++){
      $scope.playings[0].reponses[i].rank = Math.random();
    };
  };

  $scope.themeSelect = function(theme_id){
    $scope.viewTheme = false;
    $scope.currentTheme = theme_id;
    $scope.launched = true;
    playQuestion(theme_id);
  };

  $scope.GetPlayingGames = function(id){
    var toto = gameService.get_playing_games(id);
    toto.then(function(data) {
        $scope.playing_games = data;
        new_data = $filter('filter')(data,{current_player: id.toString()});
        $scope.notif = new_data.length;
      });
  };

  if($scope.is_logged) $scope.GetPlayingGames($scope.current_user.id_user);

  $scope.NewGame = function(id,pseudo){
    var toto = gameService.new_game(id,pseudo);
    toto.then(function(data) {
        $scope.id_current_game = data;
        $scope.ContinueGame($scope.id_current_game);
      });
  };

  $scope.ContinueGame = function(id){
    var toto = gameService.get_current_game(id);
    toto.then(function(data){
      $scope.current_game = data[0];
      $scope.current_game.round = Number($scope.current_game.round);
      $scope.current_game.score_1 = Number($scope.current_game.score_1); 
      $scope.current_game.score_2 = Number($scope.current_game.score_2);
      $scope.PlayRound(); 
    });
  };

  $scope.PlayRound = function() {
    $scope.scoreRound = 0;
    $scope.falseRep = 0;
    $scope.turn = 0;
    ThemeRandom();
    $scope.viewTheme = true;
  };

  $scope.End = function(turnNum){
    if(turnNum == 3){
      $scope.savedScore[$scope.current_game.round] = $scope.scoreRound / 3;
      $scope.sevedFalseRep[$scope.current_game.round] = $scope.falseRep / 3;
      $scope.current_game.round += 1;
      if($scope.current_user.id_user == $scope.current_game.user_id_1){
        $scope.current_game.score_1 +=  $scope.scoreRound;
        $scope.current_game.current_player = $scope.current_game.user_id_2;
      }else{
        $scope.current_game.score_2 +=  $scope.scoreRound;
        $scope.current_game.current_player = $scope.current_game.user_id_1;
      };
      if($scope.current_game.round >= (total_round*2)) $scope.current_game.is_finished = true;
      var toto = gameService.update_current_game($scope.current_game);
      toto.then(function(data){
        $scope.launched = false;
        $scope.GetNotifGames($scope.current_user.id_user);
        $scope.GetPlayingGames($scope.current_user.id_user);
      });
    };
  };

  $scope.reponseCheck = function(reponse) {
    if (reponse){
      $scope.turn += 1;
      $scope.score += 1;
      $scope.scoreRound += 1;
      $scope.falseRep = $scope.turn - $scope.scoreRound;
      $scope.End($scope.turn); 
      playQuestion($scope.currentTheme);
    }else{
      $scope.turn += 1;
      $scope.falseRep = $scope.turn - $scope.scoreRound;
      $scope.End($scope.turn);
      playQuestion($scope.currentTheme);
    };
  };

}]);

app.controller('AddQuestions', ['$scope', '$http', function($scope,$http) {
    $http.get('./php/get_themes.php').
      success(function(data) {
        $scope.themes = data;
      });
}]);

app.controller('SignIn', ['$scope', '$http', function($scope,$http) {
    $http.get('./php/get_class.php').
      success(function(data) {
        $scope.classes_user = data;
      });
}]);

app.controller('GameStory', ['$scope', '$http','gameStoryService', function($scope,$http,gameStoryService) {

    $scope.GetFinishedGames = function(id){
    var toto = gameStoryService.get_finished_games(id);
      toto.then(function(data) {
        $scope.finished_games = data;
      });
    };
    if($scope.is_logged) $scope.GetFinishedGames($scope.current_user.id_user);
}]);


app.controller('ValidateQuestions', ['$scope','$http', function($scope,$http){
  load_scope = function(){
    $http.get('./php/get_unvalidate_questions.php').
      success(function(data) {
        $scope.unvalid_questions = data;
        $scope.questions_to_validate = data.length;
      });
  };

  $http.get('./php/get_themes.php').
    success(function(data) {
      $scope.themes = data;
  });

  $scope.is_questions = function(){
    if($scope.unvalid_questions){
      return $scope.unvalid_questions.length;
    }else{
      return 0;
    }
  };

  $scope.validation = function(question) {
    $http.post('./php/validate_question.php',{
          'id': question.id_question, 
          'value': question.value_question,
          'theme_id': question.theme_id,
          'good_rep': question.good_rep,
          'bad_rep1': question.bad_rep1,
          'bad_rep2': question.bad_rep2,
          'bad_rep3': question.bad_rep3}
      ).
      success(function(){
        load_scope();
      });
    };
  load_scope();
}]);