<?php
        // set up the connection variables
       include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $pseudo = htmlspecialchars($request['pseudo']);
        $code_quizz = htmlspecialchars($request['code_quizz']);
        $sql1 = "SELECT id_quizz FROM quizz WHERE code_quizz = '$code_quizz'";
        $stmt1 = $dbh->prepare($sql1);
        $stmt1->execute();
        $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $quizz_id = $result1[0]['id_quizz'];

        if(count($result1)!=0){
            $sql = "UPDATE users SET quizz_id = '$quizz_id' WHERE pseudo = '$pseudo'";
            $stmt = $dbh->prepare($sql);
            $stmt->execute();
            $data = [];
            $data['success'] = true;
            $msg = json_encode($data);
            print $msg;     
        }else{
            echo("Le code n'es pas valable.");   
        };
?>