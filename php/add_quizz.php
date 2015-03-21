<?php
        session_start();
        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $name = htmlspecialchars($request['name_quizz']);
        $user_id = $_SESSION['id-user'];
        $code_quizz = sprintf("%06d", mt_rand(100000, 999999));;

        if($name){
                $sql = "INSERT INTO quizz (name_quizz,code_quizz,user_id) VALUES ('$name',' $code_quizz','$user_id')";
                $stmt = $dbh->prepare($sql);
                $stmt->execute();
                $data = [];
                $data['success'] = true;
                $data['code_quizz'] = $code_quizz;
                $msg = json_encode($data);
                print $msg;
        }else{
                print "Veuillez entrer un nom pour le quizz";
        };
?>