<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $round =  $request['round'];
        $current_player =  $request['current_player'];
        $is_finished =  $request['is_finished'];

        $sql = "UPDATE games SET round = '$round', current_player = '$current_player', is_finished = '$is_finished' WHERE id_game = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        echo $sql;

?>