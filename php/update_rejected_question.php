<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $value =  str_replace("'","\'" , htmlspecialchars($request['value']));
        $theme_id = str_replace("'","\'" , htmlspecialchars($request['theme_id']));
        $good_rep =  str_replace("'","\'" , htmlspecialchars($request['good_rep']));
        $bad_rep1 =  str_replace("'","\'" , htmlspecialchars($request['bad_rep1']));
        $bad_rep2 =  str_replace("'","\'" , htmlspecialchars($request['bad_rep2']));
        $bad_rep3 =  str_replace("'","\'" , htmlspecialchars($request['bad_rep3']));

        $sql = "UPDATE questions SET value_question = '$value',theme_id = '$theme_id', good_rep = '$good_rep', bad_rep1 = '$bad_rep1', bad_rep2 = '$bad_rep2', bad_rep3 = '$bad_rep3', valid = '0',rejected='0' WHERE id_question = '$id'";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
?>