<?php
        // set up the connection variables
       include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $pseudo = htmlspecialchars($request['pseudo']);
        $password = md5(htmlspecialchars($request['password'])); 
        $password_confirmation = md5(htmlspecialchars($request['password_confirmation']));
        $admin = 0;
        $sql1 = "SELECT pseudo FROM users WHERE pseudo = '$pseudo'";
        $stmt1 = $dbh->prepare($sql1);
        $stmt1->execute();
        $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);


        if($pseudo && $password){
            if(count($result1)==0){
                if($password == $password_confirmation) {
                        $sql = "INSERT INTO users (pseudo ,password ,admin) VALUES ('$pseudo','$password','$admin')";
                        $stmt = $dbh->prepare($sql);
                        $stmt->execute();
                        $data = [];
                        $data['success'] = true;
                        $msg = json_encode($data);
                        print $msg;
                }else{
                    echo("La Confirmation ne correspond pas au mot de passe");
                }            
            }else{
                echo("Le Pseudo est déja utilisé");
            }                  
        }else{
            echo("Veuillez remplir tous les champs");   
        };
?>