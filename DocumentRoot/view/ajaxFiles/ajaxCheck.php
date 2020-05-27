<?php
	//TODO: something about this doesn't seem to work
	if(!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])=='xmlhttprequest')){
		header('HTTP/1.0 403 Forbidden');
		die();
	}
?>