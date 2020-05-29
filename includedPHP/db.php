<?php
	session_start();

	$pdo = new PDO('mysql:host=db;dbname=tabby;charset=utf8', 'tab_admin', 'controllerofthetabs');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	//wrapper function for prepare/execute using PDO

	function querySafe($statement,$args,$fetchAs=NULL){
		global $pdo;
		$ret=NULL;
		try{
			$stmt=$pdo->prepare($statement);
			$stmt->execute($args);
			if($fetchAs==NULL){
				$ret="success";
			}else{
				//TODO: only grab first index? It seems to always return its thing as the only element in an array.
				$ret=$stmt->fetchAll($fetchAs);
			}
			return $ret;
		}catch(PDOException $e){
			throw new Exception($e->getCode());
		}
	}
	//wrapper function for normal SQL query using PDO
	function queryNormal($statement,$fetchAs=NULL){
		global $pdo;
		$ret=NULL;
		try{
			if($fetchAs==NULL){
				$ret="success";
			}else{
				$ret=$pdo->query($statement)->fetchAll($fetchAs);
			}
			return $ret;
		}catch(PDOException $e){
			throw new Exception($e->getCode());
			//$ret=['error',$e->getCode()];
		}
		//return $ret;
	}

	function auth($username,$password){
		if(empty($username) || empty($password)){
			return false;
		}
		
		try{
			$res=querySafe('SELECT password FROM users WHERE username=? LIMIT 1;',[$username],PDO::FETCH_ASSOC);
		}catch(Exception $e){ //something went wrong, don't authenticate
			return false;
		}
		//echo "comparing $password with " . $res[0]["password"] . "<br />";
		
		if(password_verify($password,$res[0]["password"])){
		  //echo "passwords match!<br />";
		  return true;
		}else{
		  //echo "passwords don't match?<br />";
		  return false;
		}
	  }
?>