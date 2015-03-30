<?php

        include 'connect_db.php';
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata, TRUE);

        $id =  $request['id'];
        $pseudo =  htmlspecialchars($request['pseudo']);

        $sql1 = "SELECT pseudo FROM users WHERE pseudo = '$pseudo'";
        $stmt1 = $dbh->prepare($sql1);
        $stmt1->execute();
        $result1 = $stmt1->fetchAll(PDO::FETCH_ASSOC);

		if(count($result1)==0){
			$sql = "UPDATE users SET pseudo = '$pseudo' WHERE id_user = '$id'";
        	$stmt = $dbh->prepare($sql);
        	$stmt->execute();
        	$data = [];
            $data['success'] = true;
            $msg = json_encode($data);
            print $msg;
		}else{
            echo("Le pseudo est déja utilisé");
        };        
        
?>

