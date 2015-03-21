<?php
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);
        $name = htmlspecialchars($request['name_theme']);
        $description = htmlspecialchars($request['description_theme']);
        $quizz_id = htmlspecialchars($request['quizz_id']);


        if($name && $description && $quizz_id){
        $sql = "INSERT INTO themes (quizz_id,name_theme,description_theme,playable) VALUES ('$quizz_id','$name','$description','0')";
                $stmt = $dbh->prepare($sql);
                $stmt->execute();
                $data = [];
                $data['success'] = true;
                $msg = json_encode($data);
                print $msg;
        }else{
                print "Veuillez remplir tout les champs";
        };
?>