<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $score_add =  intval($request['score_add']);

        $sql1 = "SELECT id_user,score_user FROM users WHERE id_user = '$id'";
        $stmt1 = $dbh->prepare($sql1);
        $stmt1->execute();
        $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $current_score = intval($result1[0]["score_user"]);
        $score_user = $current_score + $score_add;
        echo($score_add);
        
        $sql = "UPDATE users SET score_user = '$score_user' WHERE id_user = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();

?>

