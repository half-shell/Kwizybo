var app = angular.module('lectorQuizz.controllers', []);

app.controller('Acceuil', ['$scope','loginService', function ($scope,loginService) {
  $scope.is_connected();
}]);

app.controller('Navigation', ['$scope','$http','$location','$filter','loginService','gameService', function($scope,$http,$location,$filter,loginService,gameService){
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

app.controller('Parties', ['$scope','$interval', '$http','$filter','gameService', function($scope,$interval,$http,$filter,gameService) {
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

app.controller('AddQuestions', ['$scope', '$http', function($scope,$http) {
  $scope.is_connected();

  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes = data;
      });

  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_add = false;

  $scope.add_question = function(data){
    if(data){
    $http.post('./php/add_question.php',{
      'theme_id': data.theme_id,
      'value': data.value,
      'good_rep': data.good_rep,
      'bad_rep1': data.bad_rep1,
      'bad_rep2': data.bad_rep2,
      'bad_rep3': data.bad_rep3
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.data = {};
        $scope.succes_add = true;
        $scope.bad_infos = false;
        $scope.msg = "Question proposée avec succès";
      }else{
        $scope.infos = true;
        $scope.succes_add = false;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.succes_add = false;
    $scope.bad_infos = true;
    $scope.msg = "Tous les champs ne sont pas remplis";
  };
  };
}]);

app.controller('GameStory', ['$scope', '$http','gameStoryService', function($scope,$http,gameStoryService) {
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


app.controller('ValidateQuestions', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_unvalidate_questions.php',{
      'quizz_id': $scope.current_user.quizz_id
    }).
      success(function(data){
        $scope.unvalid_questions = data;
        $scope.questions_to_validate = data.length;
      });
  };

  $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    }
  };

  $scope.index = 0;
  $scope.clear = function(){
    updated_question = {};
  };

  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
    };

  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
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
  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
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
        $http.post('./php/update_user_score.php',{
          'id': question.user_id,
          'score_add': 1,
          'questions_added': 1
        });
      });
    };
    $scope.reject = function(question) {
    $http.post('./php/reject_question.php',{
          'id': question.id_question,
          'reject_reason': question.reject_reason
         }
      ).
      success(function(){
        load_scope();
      });
    };
  load_scope();
}]);

app.controller('AddTheme', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_add = false;

   $http.get('./php/get_quizz.php').
    success(function(data) {
      $scope.quizz = data;
  });

  $scope.add_theme = function(data){
    if(data){
    $http.post('./php/add_themes.php',{
      'quizz_id': data.quizz_id,
      'name_theme': data.name_theme,
      'description_theme': data.description_theme
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.data = {};
        $scope.succes_add = true;
        $scope.bad_infos = false;
        $scope.msg = "Thème ajouté avec succès";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Tous les champs ne sont pas remplis";
  };
  };
}]);

app.controller('AddQuizz', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_add = false;

  $scope.add_quizz = function(data){
    if(data){
    $http.post('./php/add_quizz.php',{
      'name_quizz': data.name_quizz
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.succes_add = true;
        $scope.bad_infos = false;
        $scope.data = {};
        $scope.msg = "Quizz ajouté avec succès. Celui-ci a pour CODE : ";
        $scope.quizz_code = msg.code_quizz;
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez entrer un nom pour le quizz";
  };
  };
}]);

app.controller('SetThemes', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope_theme = function(){
    $http.get('./php/get_setting_theme.php').
      success(function(data) {
        $scope.themes = data;
      });
  };

  $http.get('./php/get_quizz.php').
    success(function(data) {
      $scope.quizz = data;
  });


  $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    };
  };


  $scope.validation = function(theme) {
    $http.post('./php/update_themes.php',{
          'id': theme.id_theme,
          'name_theme': theme.name_theme,
          'description_theme': theme.description_theme,
          'playable': theme.playable
      }).
      success(function(){
        $scope.infos = true;
        $scope.updated_theme_name = theme.name_theme;
        load_scope_theme();
      });
    };
  load_scope_theme();
}]);

app.controller('SetQuestions', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_questions.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.questions = data;
      });
  };

    $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    };
  };

  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes = data;
      });

  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes_filter = data;
        $scope.themes_filter.push({
          name_theme: 'Tous les thèmes',
          id_theme: '!'
        })
      });

  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
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
        $scope.infos = true;
        $scope.updated_question_value = question.value_question;
      });
    };
  load_scope();
}]);

app.controller('SetQuizz', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.get('./php/get_quizz.php').
      success(function(data) {
        $scope.quizz = data;
      });
  };

  $scope.validation = function(quizz) {
    $http.post('./php/update_quizz.php',{
          'id': quizz.id_quizz,
          'name_quizz': quizz.name_quizz
        }
      ).
      success(function(){
        load_scope();
        $scope.infos = true;
        $scope.updated_quizz_name = quizz.name_quizz;
      });
    };
  load_scope();
  $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    };
  };
}]);

app.controller('Ladder', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_ladder.php',{
      'quizz_id': $scope.current_user.quizz_id
    }).
      success(function(data) {
        $scope.users = data;
      });
  };
  load_scope();
}]);


app.controller('SignUp', ['$scope','$http', function($scope,$http){
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes_1 = false;

  $scope.add_user = function(data){
    if(data){
    $scope.pseudo_tmp = data.pseudo;
    $http.post('./php/add_user.php',{
      'pseudo': data.pseudo,
      'password': data.password,
      'password_confirmation': data.password_confirmation
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.success_1 = true;
        $scope.bad_infos = false;
        $scope.data = {};
        $scope.msg = "Inscription Réussie";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez remplir tous les champs";
  };
  };

  $scope.add_quizz_code = function(data){
    if(data){
    $http.post('./php/add_user_quizz.php',{
      'code_quizz': data.code_quizz,
      'pseudo': $scope.pseudo_tmp
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.success_2 = true;
        $scope.bad_infos = false;
        $scope.data = {};
        $scope.msg = "Inscription au quizz réussie.";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez remplir tous les champs";
  };
  };
}]);

app.controller('JoinQuizz', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;
  $scope.succes = false;

   $scope.add_quizz_code = function(data){
    if(data){
    $http.post('./php/add_user_quizz.php',{
      'code_quizz': data.code_quizz,
      'pseudo': $scope.current_user.pseudo
    })
    .success(function(msg){
      if(msg.success == true){
        $scope.infos = true;
        $scope.success = true;
        $scope.bad_infos = false;
        $scope.msg = "Inscription au quizz réussie.";
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = msg;
      };
    });
  }else{
    $scope.infos = true;
    $scope.bad_infos = true;
    $scope.msg = "Veuillez entrer un code";
  };
  };
}]);

app.controller('SetUsers', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_users.php',{
      'quizz_id': $scope.current_user.quizz_id
    }).
      success(function(data) {
        $scope.users = data;
      });
  };
    $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    };
  };

  $scope.validation = function(users){
    $http.post('./php/update_pass_user.php',{
          'id': users.id_user,
          'password': '1234'
        }
      ).
      success(function(){
        load_scope();
        $scope.infos = true;
        $scope.updated_user_pseudo = users.pseudo;
      });
    };
  load_scope();
}]);



app.controller('MyAccount', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  $scope.infos = false;
  $scope.bad_infos = false;

  $scope.change_username = function(user){
    $scope.infos = false;
    $scope.bad_infos = false;
    if(user){
      $http.post('./php/update_username.php',{
          'id': $scope.current_user.id_user,
          'pseudo': user.pseudo
        }
      ).
      success(function(msg){
        if(msg.success == true){
          $scope.infos = true;
          $scope.bad_infos = false;
          $scope.msg = "Changement de pseudo éffectué avec succès.";
        }else{
          $scope.infos = true;
          $scope.bad_infos = true;
          $scope.msg = msg;
        };
      });
    }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = "Veuillez choisir un nouveau pseudo.";
    };
  };

  $scope.change_password = function(user){
    $scope.infos = false;
    $scope.bad_infos = false;
    if(user){
      if(CryptoJS.MD5(user.old_pass) == $scope.current_user.password){
        if(user.new_pass == user.new_pass_conf){
          $http.post('./php/update_pass_user.php',{
                'id': $scope.current_user.id_user,
                'password': user.new_pass
              }
            ).
            success(function(){
              $scope.infos = true;
              $scope.bad_infos = false;
              $scope.msg = "Changement de mot de passe avec succès.";
            });
        }else{
          $scope.infos = true;
          $scope.bad_infos = true;
          $scope.msg = "La confirmation du mot de passe ne correspond pas.";
        };
      }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = "L'ancien mot de passe ne correspond pas.";
      };
    }else{
        $scope.infos = true;
        $scope.bad_infos = true;
        $scope.msg = "Tous les champs ne sont pas remplis.";
    };
  };
}]);

app.controller('RejectedQuestions', ['$scope','$http', function($scope,$http){
  $scope.is_connected();
  load_scope = function(){
    $http.post('./php/get_rejected_questions.php',{
      'id_user': $scope.current_user.id_user
    }).
      success(function(data){
        $scope.recjected_questions = data;
        $scope.rejected_count = data.length;
      });
  };
  $scope.fieldOrder = null;
  $scope.directionOrder = null;
  $scope.setFieldOrder = function(field){
    if($scope.fieldOrder == field){
      $scope.directionOrder = !$scope.directionOrder;
    }else{
      $scope.fieldOrder = field;
      $scope.directionOrder = false;
    }
  };

  $scope.cssOrder = function(field){
    return{
      'glyphicon': $scope.fieldOrder == field,
      'glyphicon-chevron-up': $scope.fieldOrder == field && !$scope.directionOrder,
      'glyphicon-chevron-down': $scope.fieldOrder == field && $scope.directionOrder
    };
  };
  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
    };
  $http.post('./php/get_themes.php',{
    'quizz_id': $scope.current_user.quizz_id
  }).
      success(function(data) {
        $scope.themes = data;
      });

  $scope.is_questions = function(){
    if($scope.recjected_questions){
      return $scope.recjected_questions.length;
    }else{
      return 0;
    }
  };
  $scope.delete_question = function(question) {
    $http.post('./php/delete_question.php',{
          'id': question.id_question
      }).
      success(function(){
        load_scope();
      });
    };

  $scope.validation = function(question) {
    $http.post('./php/update_rejected_question.php',{
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
