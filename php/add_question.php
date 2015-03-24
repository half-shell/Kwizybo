<?php
        session_start();
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $theme_id = htmlspecialchars($request['theme_id']);
        $value = htmlspecialchars($request['value']);
        $good_rep = htmlspecialchars($request['good_rep']);
        $bad_rep1 = htmlspecialchars($request['bad_rep1']);
        $bad_rep2 = htmlspecialchars($request['bad_rep2']);
        $bad_rep3 = htmlspecialchars($request['bad_rep3']);
        $user_id = $_SESSION['id-user'];

        if($theme_id && $value && $good_rep && $bad_rep1 && $bad_rep2 && $bad_rep3){
                $sql = "INSERT INTO questions (theme_id, value_question, good_rep, bad_rep1, bad_rep2, bad_rep3, valid, user_id) VALUES ('$theme_id','$value','$good_rep','$bad_rep1','$bad_rep2','$bad_rep3','0','$user_id')";
                $stmt = $dbh->prepare($sql);
                $stmt->execute();
                $data = [];
                $data['success'] = true;
                $msg = json_encode($data);
                print $msg;
        }else{
                print "Veuillez remplir tout les champs";
        }
?>