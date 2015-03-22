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
    $routeProvider.when('/Questions', {
         title: '- Ajouter une Question',
        controller: 'AddQuestions',
        templateUrl: 'partials/add_question.html'
    });
    $routeProvider.when('/Inscription', {
         title: '- Inscription',
        controller: 'SignIn',
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
    $routeProvider.otherwise('/Home');
  });

app.run(function($rootScope, $location, loginService){
    var routespermission = ['/Game','/Questions','/Themes','/ValiderQuestions','/Historique','/AjouterQuizz','/GererQuestions','/GererThemes'];  //route that require login
    var adminpermission = ['/Themes','/ValiderQuestions','/AjouterQuizz','/GererQuestions','/GererThemes'];
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
        }
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
});