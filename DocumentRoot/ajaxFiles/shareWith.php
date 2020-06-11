<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	http_response_code(403);
	die("Only owner can share");
}

try{
	$res=querySafe("INSERT INTO shares (tab,user,can_edit) VALUES (?,(SELECT id FROM users WHERE username=?),0)",[$tab_id,$_POST["user"]]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die("Shared with ".$_POST["user"]);
?>