<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if($can_edit){
	die("E: No edit priviledge");
}

//TODO: check for validity? Don't want them saving weird things as tabs
//also potential vulnerability with shared users opening up whatever weird JSON someone else sent there??
try{
	$res=querySafe("UPDATE tabs SET tab_data=? WHERE tabs.id=?",[$_POST["data"],$tab_id]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die("Tab Saved");
?>