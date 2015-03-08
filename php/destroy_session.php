<?php 
	session_id('uid');
	session_id('id-user');
	session_start();
	session_destroy();
	session_commit();
?>