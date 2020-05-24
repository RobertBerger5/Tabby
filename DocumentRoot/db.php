<?php
	$pdo = new PDO('mysql:host=db;dbname=tabby;charset=utf8', 'tab_admin', 'controllerofthetabs');
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	//wrapper function for prepare/execute using PDO
	function querySafe($statement,$args,$fetchAs=PDO::FETCH_NUM){
		global $pdo;
		$ret=NULL;
		try{
			$stmt=$pdo->prepare($statement);
			$stmt->execute($args);
			$ret=$stmt->fetchAll($fetchAs);
		}catch(PDOException $e){
			$ret=['error',$e->getCode()];
		}
		return $ret;
	}
	//wrapper function for normal SQL query using PDO
	function queryNormal($statement,$fetchAs=PDO::FETCH_NUM){
		global $pdo;
		$ret=NULL;
		try{
			$ret=$pdo->query($statement)->fetchAll($fetchAs);
		}catch(PDOException $e){
			$ret=['error',$e->getCode()];
		}
		return $ret;
	}

	function auth($username,$password){
		$res=querySafe('SELECT password FROM users WHERE username=? LIMIT 1;',[$username],PDO::FETCH_ASSOC);
		
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