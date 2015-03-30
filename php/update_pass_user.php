<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $password =  md5(htmlspecialchars($request['password']));

        $sql = "UPDATE users SET password = '$password' WHERE id_user = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
?>

