<?php
//will die if user doesn't have permission to view, or any other issue
require 'ajaxCheck.php';

if(!$is_owner){
	http_response_code(403);
	die("Only owner can delete");
}


try{
	$res=querySafe("DELETE FROM shares WHERE tab=?",[$tab_id]);
	//instead of deleting it, we keep the tab and its data, both to recover it and to trace fork lineages
	$res=querySafe("UPDATE tabs SET title='[deleted]',user=1,is_public=0 WHERE id=?",[$tab_id]);
}catch(Exception $e){
	http_response_code(500);
	die("PDO Error ".$e->getMessage());
}

http_response_code(200);
die("Tab Deleted");
?>