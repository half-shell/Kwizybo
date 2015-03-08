<?php
        // set up the connection variables
        include 'connect_db.php';

        $theme_id = htmlspecialchars($_POST['theme_id']);
        $value = htmlspecialchars($_POST['value']);
        $good_rep = htmlspecialchars($_POST['good_rep']);
        $bad_rep1 = htmlspecialchars($_POST['bad_rep1']);
        $bad_rep2 = htmlspecialchars($_POST['bad_rep2']);
        $bad_rep3 = htmlspecialchars($_POST['bad_rep3']);

        if($theme_id && $value && $good_rep && $bad_rep1 && $bad_rep2 && $bad_rep3){
                $sql = "INSERT INTO questions (theme_id, value_question, good_rep, bad_rep1, bad_rep2, bad_rep3, valid) VALUES ('$theme_id','$value','$good_rep','$bad_rep1','$bad_rep2','$bad_rep3','0')";
                $stmt = $dbh->prepare($sql);
                $stmt->execute();
                header("location: ../#/Home");
        }else{
                header("location: ../#/Questions");
        }
?>