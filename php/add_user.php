<?php
        // set up the connection variables
       include 'connect_db.php';

        $pseudo = htmlspecialchars($_POST['pseudo']);
        $password = md5(htmlspecialchars($_POST['password'])); 
        $password_confirmation = md5(htmlspecialchars($_POST['password_confirmation']));
        $admin = 0;

        if($pseudo && $password){
            if ($password == $password_confirmation) {
                    $sql = "INSERT INTO users (pseudo ,password ,admin) VALUES ('$pseudo','$password','$admin')";
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