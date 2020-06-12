<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	http_response_code(403);
	die("No edit priviledge");
}

try{
	$res=querySafe("UPDATE tabs SET title=? WHERE id=?",[$_POST["name"],$tab_id]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die("Tab Renamed");
?>