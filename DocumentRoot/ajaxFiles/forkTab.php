<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

$newID=NULL;

try{
	//probably a more efficient way of copying from one row to another and changing some values around, but this is fine for now
	$data=querySafe("SELECT title,tab_data FROM tabs WHERE id=?",[$tab_id],PDO::FETCH_ASSOC)[0];
	$res=querySafe("INSERT INTO tabs (title,user,forked_from,is_public,tab_data) VALUES (?,(SELECT id FROM users WHERE username=?),?,0,?)",[$data["title"],$username,$tab_id,$data["tab_data"]]);
	$newID=$pdo->lastInsertId();
	$res=querySafe("INSERT INTO shares (tab,user,can_edit) VALUES (?,(SELECT id FROM users WHERE username=?),1)",[$newID,$username]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die($newID);
?>