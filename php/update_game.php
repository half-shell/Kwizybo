<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $score_1 =  $request['score_1'];
        $score_2 = $request['score_2'];
        $round =  $request['round'];
        $current_player =  $request['current_player'];
        $is_finished =  $request['is_finished'];

        $sql = "UPDATE games SET score_1 = '$score_1', score_2 = '$score_2', round = '$round', current_player = '$current_player', is_finished = '$is_finished' WHERE id_game = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        echo $sql;

?>