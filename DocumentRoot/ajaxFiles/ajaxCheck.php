<?php
/*
Code that should be executed for any tab-related AJAX work, makes sure that...:
	it's over AJAX and not just someone accessing this page directly? Doesn't really harm anything if they do though, just kinda ugly
	there is post data
	the user is logged in
	the user's login info is valid
	tab is shared with the user
	page that required this one knows if this user can edit or not
	page that required this one knows if this user is owner or not
*/

require '../../includedPHP/db.php';
//TODO: something about this doesn't seem to work
/*if(!(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])=='xmlhttprequest')){
	header('HTTP/1.0 403 Forbidden');
	die();
}*/

$username=$_SESSION["username"];
$password=$_SESSION["password"];
$tab_id=$_POST["id"];
$can_edit=FALSE;
$is_owner=FALSE;
if(empty($_POST)){
	http_response_code(400);
	die("No data");	
}else if(empty($username) || empty($password)){
	http_response_code(401);
	die("Not Logged In");
}else if(!auth($username,$password)){
	http_response_code(401);
	die("Authentication Failure");
}

try{
	//TODO: more clever way of doing all of these with only one query?

	$res=querySafe('SELECT EXISTS(SELECT 1 FROM tabs t JOIN shares s ON t.id=s.tab JOIN users u ON u.id=s.user WHERE u.username=? AND t.id=?) AS shared',[$username,$tab_id],PDO::FETCH_ASSOC)[0];
	if($res['shared']==0){
		http_response_code(403);
		die("Not Shared");
	}

	$res=querySafe('SELECT s.can_edit FROM tabs t JOIN shares s ON t.id=s.tab JOIN users u ON u.id=s.user WHERE u.username=? AND t.id=?',[$username,$tab_id],PDO::FETCH_ASSOC)[0];
	if($res['can_edit']==1){
		$can_edit=TRUE;
	}

	$res=querySafe('SELECT EXISTS(SELECT 1 FROM tabs t JOIN users u ON t.user=u.id WHERE u.username=? AND t.id=?) AS own',[$username,$tab_id],PDO::FETCH_ASSOC)[0];
	if($res['own']==1){
		$is_owner=TRUE;
	}
}catch(Exception $e){
	//echo "PDO ERROR: ".$e->getMessage()."<br>";
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

?>