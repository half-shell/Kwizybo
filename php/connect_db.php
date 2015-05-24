<?php
 	$db_name  = 'Kwizybo';
    $hostname = '127.0.0.1';
    $username_db = 'root';
    $password_db = 'root';
    $dbh = new PDO("mysql:host=$hostname;dbname=$db_name;port=8889", $username_db, $password_db);
    return $dbh
?>
