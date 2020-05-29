<?php
require 'ajaxCheck.php';

if(!$can_edit){
	die("E: No edit priviledge");
}

//TODO: check for validity? Don't want them saving weird things as tabs
//also potential vulnerability with shared users opening up whatever weird JSON someone else sent there??

try{
	$res=querySafe("UPDATE tabs SET tab_data=? WHERE tabs.id=?",[$_POST["data"],$id]);
}catch(Exception $e){
	echo "PDO ERROR: ".$e->getMessage()."<br>";
	die("E: PDO Error");
}
die();
?>