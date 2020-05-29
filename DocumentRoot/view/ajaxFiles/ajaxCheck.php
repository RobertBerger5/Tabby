<?php
/*
Code that should be executed for any tab-related AJAX work, makes sure that...:
	it's over AJAX and not just someone accessing this page directly? Doesn't really harm anything if they do though
	there is post data
	the user is logged in
	the user's login info is valid
	tab is shared with the user
	page that required this one knows if this user has edit access or not
*/

require '../../db.php';
//TODO: something about this doesn't seem to work
/*if(!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])=='xmlhttprequest')){
	header('HTTP/1.0 403 Forbidden');
	die();
}*/
$username=$_SESSION["username"];
$password=$_SESSION["password"];
$tab_id=$_POST["id"];
$can_edit=FALSE;
if(empty($_POST)){
	die("E: No data");	
}else if(empty($username) || empty($password)){
	die("E: Not Logged In");
}else if(!auth($username,$password)){
	die("E: Authentication Failure");
}

try{
	$res=querySafe('SELECT EXISTS(SELECT 1 FROM tabs t JOIN shares s ON t.id=s.tab JOIN users u ON u.id=s.user WHERE u.username=? AND t.id=?) AS shared',[$username,$tab_id],PDO::FETCH_ASSOC);
	if($res[0]['shared']==0){
		die("E: Not Shared");
	}

	//TODO: more clever way of doing this with only one query? Even just count()?
	$res=querySafe('SELECT s.can_edit FROM tabs t JOIN shares s ON t.id=s.tab JOIN users u ON u.id=s.user WHERE u.username=? AND t.id=?',[$username,$tab_id],PDO::FETCH_ASSOC);
	if($res[0]['can_edit']==1){
		$can_edit=TRUE;
	}
}catch(Exception $e){
	echo "PDO ERROR: ".$e->getMessage()."<br>";
	die("E: PDO Error");
}

//TODO: check if user can edit, change $can_edit if so
?>