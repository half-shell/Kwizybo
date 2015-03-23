<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $score_add =  intval($request['score_add']);
        $victories_add = intval($request['victories']);
        $defeat_add = intval($request['defeat']);
        $questions_added_add = intval($request['questions_added']);

        $sql1 = "SELECT id_user,score_user,victories,defeats,questions_added FROM users WHERE id_user = '$id'";
        $stmt1 = $dbh->prepare($sql1);
        $stmt1->execute();
        $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        var_dump($sql1);
        $current_score = intval($result1[0]["score_user"]);
        $current_victories = intval($result1[0]['victories']);
        $current_defeat = intval($result1[0]['defeat']);
        $current_questions_added = intval($result1[0]['questions_added']);

        $victories = $current_victories + $victories_add;
        $defeat = $current_defeat + $defeat_add;
        $questions_added = $current_questions_added + $questions_added_add;
        $score_user = $current_score + $score_add;
        
        $sql = "UPDATE users SET score_user = '$score_user',victories = '$victories',defeats = '$defeat',questions_added = '$questions_added' WHERE id_user = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        echo $current_score;
?>      

