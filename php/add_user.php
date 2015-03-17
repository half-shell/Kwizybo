<?php
        // set up the connection variables
       include 'connect_db.php';

        $pseudo = htmlspecialchars($_POST['pseudo']);
        $password = md5(htmlspecialchars($_POST['password'])); 
        $password_confirmation = md5(htmlspecialchars($_POST['password_confirmation']));
        $mail = htmlspecialchars($_POST['mail']);
        $admin = 0;

        if($pseudo && $password){
            if ($password == $password_confirmation) {
                    $sql = "INSERT INTO users (pseudo ,password ,mail ,admin) VALUES ('$pseudo','$password','$mail','$admin')";
                    $stmt = $dbh->prepare($sql);
                    $stmt->execute();
                    header("location: ../#/Home");
            }else{
                    header("location: ../#/Inscription");
            }
        }else{
                header("location: ../#/Inscription");   
        }
?>