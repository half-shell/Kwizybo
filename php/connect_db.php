<?php	
 	$db_name  = 'Kwizybo';
    $hostname = '127.0.0.1';
    $username_db = 'root';
    $password_db = 'gab666cool';
    $dbh = new PDO("mysql:host=$hostname;dbname=$db_name", $username_db, $password_db);
    return $dbh
?>