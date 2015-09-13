angular
  .module('lectorQuizz.controllers')
    .controller('Parties', ['$scope','$interval', '$http','$filter','gameService', function($scope,$interval,$http,$filter,gameService) {
  var timer;
  $scope.is_connected();
  $scope.Math=Math;
  var total_round = 3;
  $scope.round = 0;
  $scope.score = 0;
  $scope.savedScore = [];
  $scope.sevedFalseRep = [];
  $scope.launched = false;
  $scope.button_end_game = false;
  $scope.viewTheme = false;
  $scope.questions = [];
  $scope.bad_pseudo = false;
  $http.post('./php/get_valid_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes = data;
        $scope.themes_len = data.length;
      });

  $http.post('./php/get_users.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.users_list = data;
      });


  ThemeRandom = function(){
    $scope.randThemes = [];
    $scope.randQuestions = [];
    for (var i = 0; i < 2; i++ ){
      randt = Math.floor((Math.random() * $scope.themes.length));
      if($.inArray($scope.themes[randt],$scope.randThemes) == -1){
        $scope.randThemes.push($scope.themes[randt]);

        $http.post('./php/get_rand_questions.php',{
          'quizz_id': $scope.current_user.quizz_id,
          'theme_id': $scope.themes[randt].id_theme
        }).
          success(function(data) {
              // here the data from the api is assigned to a variable named users
              for (var i = 0 ; i < data.length; i++) {
                $scope.randQuestions.push({
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

      }else{
        i-- ;
      }
    }
  };

  setChooseTheme = function(theme_id){
    $scope.questionsThemed = [];
    for (var i = 0 ; i < $scope.randQuestions.length; i++)
      if($scope.randQuestions[i].theme_id == theme_id){
        $scope.questionsThemed.push($scope.randQuestions[i]);
      }
    return $scope.questionsThemed;
  };

  // themeQuestions = function(theme_id) 
    // $scope.questionsThemed = [];
    // for (var i = 0 ; i < $scope.questions.length; i++)
    //   if($scope.questions[i].theme_id == theme_id){
    //     $scope.questionsThemed.push($scope.questions[i]);
    //   }

    // return $scope.questionsThemed;
  // };

  launch_timer = function(time){
    $scope.timer = 0;
    $scope.timer_div = true;
    timer = $interval(function() {
      if($scope.timer >= time) {
        $scope.timer = 0;
        $scope.timer_div = false;
        $scope.reponseCheck(false);
      }else{
        $scope.timer ++;
      };
    }, 500);
  };

  playQuestion = function(theme_id){
    if($scope.turn < 3){
      $scope.launched = true;
      $scope.playings = [$scope.all_playings[$scope.turn]];
      launch_timer(30);
    };
    for(var i = 0 ; i < $scope.playings[0].reponses.length; i++){
      $scope.playings[0].reponses[i].rank = Math.random();
    };
  };

  $scope.themeSelect = function(theme_id){
    $scope.viewTheme = false;
    $scope.currentTheme = theme_id;
    $scope.launched = true;
    $scope.playings = [];
    $scope.all_playings = setChooseTheme(theme_id);
    playQuestion(theme_id);
  };

  $scope.GetPlayingGames = function(id){
    var toto = gameService.get_playing_games(id);
    toto.then(function(data) {
        $scope.playing_games = data;
        //att
        new_data = $filter('exact')(data,{current_player: id.toString()});
        $scope.notif = new_data.length;
      });
  };

  $scope.FindLeavedGame= function(id){
    var toto = gameService.get_playing_games(id);
    toto.then(function(data) {
        $scope.playing_games = data;
        var a_day = 86400000;
        $http.get('./php/get_date.php').
          success(function(data) {
            current_date = new Date(data);
            var date_now = Date.parse(current_date);
          for (var i = 0; i < $scope.playing_games.length; i++) {
            var date_game = Date.parse($scope.playing_games[i].creation_game);
            if($scope.playing_games[i].round >= (total_round*2) || date_now-date_game > 4*a_day){
              new_data_game = $scope.playing_games[i];
              new_data_game.is_finished = 1;
              var tutu = gameService.update_current_game(new_data_game);
              tutu.then(function(data){
                add_score_users(new_data_game);
                $scope.GetNotifGames($scope.current_user.id_user);
                $scope.GetPlayingGames($scope.current_user.id_user);
              });
            };
          };
          new_data = $filter('exact')(data,{current_player: id.toString()});
          $scope.notif = new_data.length;
        });
    });
  };

  if($scope.is_logged) $scope.FindLeavedGame($scope.current_user.id_user);

  $scope.NewGame = function(id,pseudo,quizz_id){
    var toto = gameService.new_game(id,pseudo,quizz_id);
    toto.then(function(data){
        $scope.id_current_game = data;
        $scope.ContinueGame($scope.id_current_game);
      });
  };

  $scope.NewSpecificGame = function(id,pseudo,quizz_id,pseudo_2){
    $scope.bad_pseudo = false;
    for (var i = 0; i < $scope.playing_games.length; i++) {
      if(pseudo_2 == $scope.playing_games[i].user_name_2 || pseudo_2 == $scope.playing_games[i].user_name_1){
        $scope.msg = "Vous avez déja une partie en cours avec ce joueur.";
        $scope.bad_pseudo = true;
      };
    };
    if($scope.bad_pseudo == false){
      var toto = gameService.new_specific_game(id,pseudo,quizz_id,pseudo_2);
      toto.then(function(data){
        $scope.id_current_game = data;
        if(data == "cantfind"){
          $scope.msg = "Ce joueur n'existe pas !";
          $scope.bad_pseudo = true;
        }else{
          $scope.ContinueGame($scope.id_current_game);
        };
      });
    };
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
    $scope.current_game.round += 1;
    if($scope.current_user.id_user == $scope.current_game.user_id_1){
       $scope.current_game.current_player = $scope.current_game.user_id_2;
    }else{
      $scope.current_game.current_player = $scope.current_game.user_id_1;
    };

    var toto = gameService.new_turn($scope.current_game);
    toto.then(function(data){
      //iter involontaire
      $scope.GetNotifGames($scope.current_user.id_user);
      $scope.GetPlayingGames($scope.current_user.id_user);
    })

    $scope.scoreRound = 0;
    $scope.falseRep = 0;
    $scope.turn = 0;
    ThemeRandom();
    $scope.viewTheme = true;
    };


  $scope.End = function(turnNum){
    $interval.cancel(timer);
    timer = undefined;
    $scope.timer_div = false;
    if(turnNum == 3){
      $scope.savedScore[$scope.current_game.round] = $scope.scoreRound / 3;
      $scope.sevedFalseRep[$scope.current_game.round] = $scope.falseRep / 3;

      if($scope.current_user.id_user == $scope.current_game.user_id_1){
        $scope.current_game.score_1 +=  $scope.scoreRound;
        $scope.current_game.current_player = $scope.current_game.user_id_2;
      }else{
        $scope.current_game.score_2 +=  $scope.scoreRound;
        $scope.current_game.current_player = $scope.current_game.user_id_1;
      };

      if($scope.current_game.round >= (total_round*2)){
        $scope.current_game.is_finished = true;
        add_score_users($scope.current_game);
      };

      var toto = gameService.update_current_game($scope.current_game);
      toto.then(function(data){
        $scope.launched = false;
        $scope.button_end_game = true;
        $scope.GetNotifGames($scope.current_user.id_user);
        $scope.GetPlayingGames($scope.current_user.id_user);
      });
    };
  };

  add_score_users = function(curr_game){
    if(curr_game.score_1 > curr_game.score_2){
      $http.post('./php/update_user_score.php',{
        'id': curr_game.user_id_1,
        'score_add': 3,
        'victories': 1
      });
       $http.post('./php/update_user_score.php',{
        'id': curr_game.user_id_2,
        'score_add': 0,
        'defeats': 1
      });
    }else if(curr_game.score_1 < curr_game.score_2){
      $http.post('./php/update_user_score.php',{
        'id': curr_game.user_id_2,
        'score_add': 3,
        'victories': 1
      });
      $http.post('./php/update_user_score.php',{
        'id': curr_game.user_id_1,
        'score_add': 0,
        'defeats': 1
      });
    }else{
      $http.post('./php/update_user_score.php',{
        'id': curr_game.user_id_1,
        'score_add': 1
      });
      $http.post('./php/update_user_score.php',{
        'id': curr_game.user_id_2,
        'score_add': 1
      });
    };
  };

  $scope.reponseCheck = function(reponse) {
    $interval.cancel(timer);
    timer = undefined;
    $scope.launched = false;
    if(reponse){
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