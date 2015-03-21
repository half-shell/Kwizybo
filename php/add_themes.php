<?php
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);
        $name = htmlspecialchars($request['name_theme']);
        $description = htmlspecialchars($request['description_theme']);
        $quizz_id = 1;

        if($name && $description){
        $sql = "INSERT INTO themes (quizz_id,name_theme,description_theme) VALUES ('$quizz_id','$name','$description')";
                $stmt = $dbh->prepare($sql);
                $stmt->execute();
                $data = [];
                $data['success'] = true;
                $msg = json_encode($data);
                print $msg;
        }else{
                print "Veuillez entrer un nom et une description pour le theme";
        };
?>