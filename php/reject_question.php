<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $reject_reason =  str_replace("'","\'" , htmlspecialchars($request['reject_reason']));

        $sql = "UPDATE questions SET  reject_reason = '$reject_reason', rejected = '1' WHERE id_question = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
?>