<!DOCTYPE html>
<html ng-app="lectorQuizz">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>LectorQuizz</title>
		<!-- Bootstrap CSS -->
		<link href="styles/style.css" rel="stylesheet">
		<link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
		<link href="bootstrap/css/bootstrap.css" rel="stylesheet">
		<script src="angular/angular.js"></script>
	</head>
	<body ng-controller="Navigation">
		<div ng-include="'partials/navigation.html'"></div>
		<div ng-view></div>

		<!-- Application-->
		<script src="js/app.js"></script> 
		<script src="js/controllers.js"></script>
		<script src="js/directives.js"></script>
		<script src="js/services.js"></script>
		<!-- jQuery -->
		<script src="angular/jquery.js"></script>
		<script src="angular/angular-route.js"></script>
		<!-- Bootstrap JavaScript -->
		<script src="bootstrap/js/bootstrap.min.js"></script>
	</body>
</html>