<?php
        // set up the connection variables
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);
        $quizz_id =  $request['quizz_id'];
        // connect to the database

        // a query get all the records from the users table
        $sql = "SELECT quizz_id_themes,id_question,user_id,theme_id,value_question,good_rep,bad_rep1,bad_rep2,bad_rep3,name_theme,pseudo FROM questions
        INNER JOIN themes ON theme_id = id_theme
        INNER JOIN users ON user_id = id_user
        WHERE valid = '1' and quizz_id_themes = '$quizz_id'";

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