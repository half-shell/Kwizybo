<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $name_quizz =  $request['name_quizz'];

        $sql = "UPDATE quizz SET name_quizz = '$name_quizz' WHERE id_quizz = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();

?>

