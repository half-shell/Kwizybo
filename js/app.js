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
    $routeProvider.when('/Questions', {
         title: '- Ajouter une Questions',
        controller: 'AddQuestions',
        templateUrl: 'partials/question_add.html'
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
        title: '- Ajouter un Themes',
        controller: 'AddTheme',
        templateUrl: 'partials/themes.html'
    });
    $routeProvider.when('/AjouterQuizz', {
         title: '- Ajouter un Quizz',
         controller: 'AddQuizz',
        templateUrl: 'partials/quizz.html'
    });
    $routeProvider.when('/ValiderQuestions', {
         title: '- Valider des Questions',
        controller: 'ValidateQuestions',
        templateUrl: 'partials/validation_question.html'
    });
     $routeProvider.when('/GererQuestions', {
         title: '- Gestion des Questions',
        controller: 'SetQuestions',
        templateUrl: 'partials/set_question.html'
    });
    $routeProvider.when('/GererThemes', {
         title: '- Gestion des Thèmes',
        controller: 'SetThemes',
        templateUrl: 'partials/set_themes.html'
    });
    $routeProvider.otherwise('/Home');
  });

app.run(function($rootScope, $location, loginService){
    var routespermission=['/Game','/Questions','/Themes','/ValiderQuestions','/Historique'];  //route that require login
    $rootScope.$on('$routeChangeStart', function(){
        if( routespermission.indexOf($location.path()) !=-1)
        {
            var connected=loginService.islogged();
            connected.then(function(msg){
                if(msg.data == 'not logged') $location.path('/Connexion');
            });
        }
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        
        $rootScope.title = current.$$route.title;
    });
});