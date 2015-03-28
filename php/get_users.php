<?php
        // set up the connection variables
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);
        $quizz_id =  $request['quizz_id'];
        // connect to the database

        // a query get all the records from the users table
        $sql = "SELECT id_user, pseudo FROM users WHERE quizz_id = '$quizz_id' AND admin = '0'";

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