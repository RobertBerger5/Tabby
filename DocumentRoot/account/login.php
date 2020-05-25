<?php
	require '../db.php';

	$error=NULL;
	if(!empty($_POST)){
		$username=$_POST["username"];
		$password=$_POST["password"];
		if(auth($username,$password)){
			$_SESSION["username"]=$username;
			$_SESSION["password"]=$password;
			header('Location: index.php', true,302);
			die();
		}else{
			session_destroy();
			$error="Authentication Error";
		}
	}else{
		//they weren't trying to send POST data, don't give them an error
	}
?>

<!doctype html>
<html lang="en">

<head>
	<title>Tabby: Login</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<!--Bootstrap 4 CSS-->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
	<!--jQuery 3.2.1-->
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
		integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous">
	</script>
	<!--Popper.js-->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
		integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous">
	</script>
	<!--Bootstrap 4 JS-->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
		integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous">
	</script>

	<!--my own stuff-->
	<link rel="stylesheet" href="/stylesheet.css">
	<link rel="stylesheet" href="account.css" />

	<script src="/general.js"></script>
	<script src="account.js"></script>
</head>

<body>
	<?php
		if($error){
			echo "<p>OOPS: ".$error."</p>";
		}
	?>
	<form method="post">
		<label for="username">Username:</label>
		<input type="text" id="username" name="username" required>
		<br>
		<label for="password">Password:</label>
		<input type="password" id="password" name="password" required>
		<br>
		<input type="submit" value="Submit">
	</form>
	<a href="register.php">register</a>
</body>
</html>