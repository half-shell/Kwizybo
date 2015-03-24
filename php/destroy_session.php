<?php 
	session_id('uid');
	setcookie('id-user');
	session_start();
	session_destroy();
	session_commit();
?>