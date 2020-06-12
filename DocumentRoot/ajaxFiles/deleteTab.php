<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	http_response_code(403);
	die("Only owner can delete");
}

try{
	//it probably takes care of the shares automatically because of unique keys or something, but do this just in case I guess
	$res=querySafe("DELETE FROM shares WHERE tab=?",[$tab_id]);
	//TODO: actually, just make all the data be [deleted] instead, to keep track of where tabs came from
	$res=querySafe("DELETE FROM tabs WHERE id=?",[$tab_id]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die("Tab Deleted");
?>