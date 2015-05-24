<?php
	include 'connect_db.php';
	$postdata = file_get_contents("php://input");
  $request = json_decode($postdata, TRUE);
  $id =  $request['id'];
  $pseudo = $request['pseudo'];
  $quizz_id = $request['quizz_id'];
  $pseudo_2 = $request['pseudo_2'];

	$sql = "SELECT id_user, pseudo FROM users WHERE quizz_id = '$quizz_id' AND pseudo = '$pseudo_2'";
  $stmt = $dbh->prepare($sql);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

  if($result != []){
    $id2 = $result[0]['id_user'];
	  $pseudo2 = $result[0]['pseudo'];
	  $id_game = uniqid();

	  $sql2 = "INSERT INTO games (id_game,user_id_1, user_id_2, score_1, score_2, round ,current_player, is_finished) VALUES ('$id_game','$id','$id2','0','0','0','$id','0')";
	  $stmt2 = $dbh->prepare($sql2);
	  $stmt2->execute();
	  $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
	  echo $id_game;
  }else{
    echo "cantfind";
  };

?>
