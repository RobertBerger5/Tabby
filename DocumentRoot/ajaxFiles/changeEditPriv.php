<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	die("Can't change privilege as non-owner");
}

//TODO: check for validity? Don't want them saving weird things as tabs
//also potential vulnerability with shared users opening up whatever weird JSON someone else sent there??
try{
	//echo $_POST["edit"].", ".$tab_id.", ".$_POST["user"]."<br>";
	$res=querySafe("UPDATE shares s JOIN users u ON s.user=u.id SET can_edit=? WHERE s.tab=? AND u.username=?",[$_POST["edit"],$tab_id,$_POST["user"]]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

//http_response_code(200);
die("Edit for ".$_POST["user"]." changed");
?>