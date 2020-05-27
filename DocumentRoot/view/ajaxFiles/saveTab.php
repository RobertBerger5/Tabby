<?php
require '../../db.php';
//require 'ajaxCheck.php';
$username=$_SESSION["username"];
$password=$_SESSION["password"];
//TODO: most of these will be repeated for all these AJAX things, so just move em there?
/*if(empty($username) || empty($password)){
	die("E: Not Logged In");
}else if(empty($_POST)){
	die("E: No info given");
}else if(!auth($username,$password)){
	die("E: Authentication Failure");
}else if(TRUE){
	//TODO: check if user has edit priviledges
}
else{*/
	//TODO: check for validity? Don't want them saving weird things as tabs
	//also potential vulnerability with shared users opening up whatever weird JSON they send here??
	echo $_POST["data"].", ".$_POST["id"]."<br>";
	$res=querySafe("UPDATE tabs SET tab_data=? WHERE tabs.id=?",[$_POST["data"],$_POST["id"]],PDO::FETCH_ASSOC);
	print_r($res);
	die("<br>".$res);
//}
?>