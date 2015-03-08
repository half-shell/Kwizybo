app = angular.module('lectorQuizz', ['lectorQuizz.controllers','lectorQuizz.services','lectorQuizz.directives','ngRoute']);

app.config(function($routeProvider) {
    $routeProvider.when('/Home', {
        controller: 'Acceuil',
        templateUrl: 'partials/home.html'
    });
    $routeProvider.when('/Game', {
        controller: 'Parties',
        templateUrl: 'partials/game.html'
    });
    $routeProvider.when('/Historique', {
        controller: 'GameStory',
        templateUrl: 'partials/game_story.html'
    });
    $routeProvider.when('/Questions', {
        controller: 'AddQuestions',
        templateUrl: 'partials/question_add.html'
    });
    $routeProvider.when('/Inscription', {
        templateUrl: 'partials/sign_in.html'
    });
    $routeProvider.when('/Connexion', {
        templateUrl: 'partials/sign_up.html'
    });
    $routeProvider.when('/Themes', {
        templateUrl: 'partials/themes.html'
    });
    $routeProvider.when('/ValiderQuestions', {
        controller: 'ValidateQuestions',
        templateUrl: 'partials/validation_question.html'
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
});