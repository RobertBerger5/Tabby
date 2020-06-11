<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if($_POST["user"]==$username){
	http_response_code(400);
	die("Can't remove yourself");
}
if(!$is_owner){
	http_response_code(403);
	die("Only owner can remove");
}

try{
	$res=querySafe("DELETE s FROM shares s JOIN users u ON s.user=u.id WHERE s.tab=? AND u.username=?",[$tab_id,$_POST["user"]]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die($_POST["user"]." removed");
?>