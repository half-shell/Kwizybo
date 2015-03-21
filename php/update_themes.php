<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $name_theme =  $request['name_theme'];
        $description_theme = $request['description_theme'];
        $playable =  $request['playable'];

        $sql = "UPDATE themes SET name_theme = '$name_theme',description_theme = '$description_theme', playable = '$playable' WHERE id_theme = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
        echo $sql;

?>

