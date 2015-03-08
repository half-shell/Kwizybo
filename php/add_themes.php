<?php
        include 'connect_db.php';

        $name = htmlspecialchars($_POST['theme_name']);
        $description = htmlspecialchars($_POST['description']);

        if($name && $description){
        $sql = "INSERT INTO themes (name_theme,description_theme) VALUES ('$name','$description')";
        $stmt = $dbh->prepare($sql);
        $stmt->execute();
                header("location: ../#/Home");
        }else{
                header("location: ../#/Themes");
        }
       
?>