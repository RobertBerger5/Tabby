<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	http_response_code(403);
	die("Only owner can transfer ownership");
}

try{
	$res=querySafe("UPDATE tabs SET user=(SELECT id FROM users WHERE username=?) WHERE id=?",[$_POST["user"],$tab_id]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die("Ownership transferred to ".$_POST["user"]);
?>