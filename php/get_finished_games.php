<?php
        // set up the connection variables
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);
        $id =  $request['id'];
        // connect to the database
        // a query get all the records from the users table
        $sql = "SELECT id_game,user_id_1,user_id_2,user_1.pseudo as user_name_1,user_2.pseudo as user_name_2,score_1,score_2,round,current_player,is_finished,creation_game
        FROM games
        INNER JOIN users user_1 ON user_id_1 = user_1.id_user
        INNER JOIN users user_2 ON user_id_2 = user_2.id_user
        WHERE ((user_id_1 = '$id') OR (user_id_2 = '$id')) AND (is_finished = '1')
        ORDER BY id_game DESC LIMIT 10";

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
