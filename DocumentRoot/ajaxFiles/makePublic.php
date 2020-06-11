<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	http_response_code(403);
	die("Only owner can toggle public");
}

try{
	$res=querySafe("UPDATE tabs SET is_public=? WHERE id=?",[$_POST["public"],$tab_id]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
if($_POST["public"]){
	die("Tab is now public");
}else{
	die("Tab is now private");
}
?>