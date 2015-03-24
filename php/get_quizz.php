<?php
        // set up the connection variables
        session_start();
        include 'connect_db.php';
        $user_id = $_COOKIE['id-user'];
        // connect to the database

        // a query get all the records from the users table
        $sql = "SELECT * FROM quizz WHERE user_id = '$user_id'";

        // use prepared statements, even if not strictly required is good practice
        $stmt = $dbh->prepare($sql);

        // execute the query
        $stmt->execute();

        // fetch the results into an array
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // convert to json
        $json = json_encode($result);

        // echo the json string
        echo $json;
?>