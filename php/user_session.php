<?php 
	$user=json_decode(file_get_contents('php://input'));  //get user from 
	$pseudo = $user->mail;
	$password = md5(htmlspecialchars($user->pass));
	include '../php/connect_db.php';
	$sql = "SELECT * FROM users WHERE pseudo='$pseudo'";
    $stmt = $dbh->prepare($sql);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$result = $result[0];

	if($result){
		if ($result["password"] == $password){
			session_start();
			setcookie('id-user', $result['id_user'],time() + 31536000);
			$_SESSION['uid']=uniqid('ang_');
			$result['uid'] = $_SESSION['uid'];
			print json_encode($result);
		}else{
			print "Mot de passe incorrect";
		};
	}else{
		print "Identifiant inconnu";
	};
?>