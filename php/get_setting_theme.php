<?php
        // set up the connection variables
        include 'connect_db.php';

        // connect to the database

        // a query get all the records from the users table
        $sql = 'SELECT name_quizz,id_theme,quizz_id,name_theme,description_theme FROM themes 
        INNER JOIN quizz ON quizz_id = id_quizz';

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