app = angular.module('lectorQuizz', ['lectorQuizz.controllers','lectorQuizz.services','lectorQuizz.directives','ngRoute']);

app.config(function($routeProvider) {
    $routeProvider.when('/Home', {
        title: '- Acceuil',
        controller: 'Acceuil',
        templateUrl: 'partials/home.html'
    });
    $routeProvider.when('/Game', {
         title: '- Parties',
        controller: 'Parties',
        templateUrl: 'partials/game.html'
    });
    $routeProvider.when('/Historique', {
         title: '- Historique',
        controller: 'GameStory',
        templateUrl: 'partials/game_story.html'
    });
    $routeProvider.when('/Classement', {
         title: '- Classement',
        controller: 'Ladder',
        templateUrl: 'partials/ladder.html'
    });
    $routeProvider.when('/AjouterQuestions', {
         title: '- Proposer une Question',
        controller: 'AddQuestions',
        templateUrl: 'partials/add_question.html'
    });
    $routeProvider.when('/Inscription', {
         title: '- Inscription',
        controller: 'SignUp',
        templateUrl: 'partials/sign_up.html'
    });
    $routeProvider.when('/Connexion', {
        title: '- Connexion',
        templateUrl: 'partials/sign_in.html'
    });
    $routeProvider.when('/Themes', {
        title: '- Ajouter un Thème',
        controller: 'AddTheme',
        templateUrl: 'partials/add_theme.html'
    });
    $routeProvider.when('/AjouterQuizz', {
         title: '- Ajouter un Quizz',
         controller: 'AddQuizz',
        templateUrl: 'partials/add_quizz.html'
    });
    $routeProvider.when('/ValiderQuestions', {
         title: '- Valider des Questions',
        controller: 'ValidateQuestions',
        templateUrl: 'partials/validation_questions.html'
    });
     $routeProvider.when('/GererQuestions', {
         title: '- Gestion des Questions',
        controller: 'SetQuestions',
        templateUrl: 'partials/set_questions.html'
    });
    $routeProvider.when('/GererThemes', {
         title: '- Gestion des Thèmes',
        controller: 'SetThemes',
        templateUrl: 'partials/set_themes.html'
    });
    $routeProvider.when('/GererQuizz', {
         title: '- Gestion des Quizz',
        controller: 'SetQuizz',
        templateUrl: 'partials/set_quizz.html'
    });
    $routeProvider.when('/RejoindreQuizz', {
         title: '- Rejoindre un Quizz',
        controller: 'JoinQuizz',
        templateUrl: 'partials/join_quizz.html'
    });
     $routeProvider.when('/GererMembres', {
         title: '- Gestion des Membres',
        controller: 'SetUsers',
        templateUrl: 'partials/set_users.html'
    });
    $routeProvider.when('/MonCompte', {
        title: '- Mon Compte',
        controller: 'MyAccount',
        templateUrl: 'partials/my_account.html'
    });
    $routeProvider.otherwise('/Home');
  });

app.run(function($rootScope, $location, loginService){
    var routespermission = ['/RejoindreQuizz','/Classement','/MonCompte','/Game','/AjouterQuestions','/Historique'];  //route that require login
    var adminpermission = ['/AjouterQuizz','/Themes','/ValiderQuestions','/GererQuizz','/GererMembres','/GererQuestions','/GererThemes'];
    var ifloggednopermit = ['/Connexion','/Inscription'];
    $rootScope.$on('$routeChangeStart', function(){
        if( routespermission.indexOf($location.path()) != -1)
        {
            var connected = loginService.islogged();
            connected.then(function(msg){ 
                if(msg.data == 'not logged') $location.path('/Connexion');
                if(adminpermission.indexOf($location.path()) != -1){
                    if(msg.data.admin != 1) $location.path('/Home');
                }; 
            });
        };
        if(ifloggednopermit.indexOf($location.path()) != -1){
          var connected = loginService.islogged();
            connected.then(function(msg){ 
                if(msg.data != 'not logged') $location.path('/Home');
            });
        };
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
});

app.filter('exact', function(){
  return function(items, match){
    var matching = [], matches, falsely = true;
    
    // Return the items unchanged if all filtering attributes are falsy
    angular.forEach(match, function(value, key){
      falsely = falsely && !value;
    });
    if(falsely){
      return items;
    }
    
    angular.forEach(items, function(item){ // e.g. { title: "ball" }
      matches = true;
      angular.forEach(match, function(value, key){ // e.g. 'all', 'title'
        if(!!value){ // do not compare if value is empty
          matches = matches && (item[key] === value);  
        }
      });
      if(matches){
        matching.push(item);  
      }
    });
    return matching;
  }
});