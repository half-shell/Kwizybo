<?php
        // set up the connection variables
        include 'connect_db.php';

        // connect to the database

        // a query get all the records from the users table
        $sql = 'SELECT name_quizz,id_theme,quizz_id,name_theme,description_theme,playable,valid, IFNULL(COUNT(id_question),0) AS count_questions FROM themes 
        LEFT JOIN questions ON questions.theme_id = themes.id_theme AND valid = 1
        INNER JOIN quizz ON quizz_id = id_quizz 
        GROUP BY id_theme';
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