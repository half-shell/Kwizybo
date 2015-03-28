<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];

        $sql = "DELETE FROM questions WHERE id_question = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
?>