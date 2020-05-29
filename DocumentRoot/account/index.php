<?php
	require '../../includedPHP/db.php';
	$username=$_SESSION["username"];
	$password=$_SESSION["password"];
	if(
		(
			empty($username) ||
			empty($password)
		) ||
		!auth($username,$password)
	){
		//unsuccessful login attempt
		header('Location: login.php', true,302);
		die();
	}
?>
<html>

<head>
	<title>Tabby: Account</title>
</head>

<body>
	<p>plan for this page:</p>
	<ul>
		<li>log out</li>
		<li>delete account</li>
		<li>change username / password</li>
		<li>friends/contacts?</li>
	</ul>
</body>

</html>