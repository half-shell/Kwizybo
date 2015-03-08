<?php 
	session_start();
	if( isset($_SESSION['uid']) && isset($_SESSION['id-user'])){
		include '../php/connect_db.php';
		$id = $_SESSION['id-user'];
		$sql = "SELECT * FROM users WHERE id_user='$id'";
    	$stmt = $dbh->prepare($sql);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$result = $result[0];
	 	print json_encode($result);
	}else{
		print 'not logged';
	};
?>