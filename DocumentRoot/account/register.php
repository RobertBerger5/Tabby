<?php
	//page allows users to register, and if they enter a valid username and password, their account is created and they're redirected to the login page
	require '../../includedPHP/db.php';
	require '../../includedPHP/functions.php';

	$error=NULL;
	if(!empty($_POST)){
		$username=$_POST["username"];
		$password=$_POST["password"];
		if(empty($username) || empty($password)){
			$error="Empty username or password given";
		}else if(!preg_match('/^[a-zA-Z0-9_\-."\']{3,20}$/',$username)){
			//regex is hard, here's what it's doing:
			//each character in the set [...] is checked for being any of these:
			//	alphanumeric
			//	underscore, hyphen, period, quote, apostrophe
			//{3,50} checks that it's between 3 and 20 characters
			$error="Invalid username";
		}else if(false && !preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/",$password)){
			//credit to https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
			//explination: at least one of the folowing
			//	lowercase
			//	uppercase
			//	number
			//	symbol
			//also 8 or more characters
			$error="Invalid password";
		}else{
			$secure=password_hash($password,PASSWORD_DEFAULT);//encrypt it using PHP's built-in password encryptor, which should be bcrypt with randomly generated salts that are stored in the string itself
			try{
				$res=querySafe('INSERT INTO users (username,password) VALUES (?,?)',[$username,$secure]);
				header('Location: login.php', true,302);
				die();
			}catch(Exception $e){
				switch($e->getMessage()){
					case '23000':
						$error="Username \"".$username."\" already taken";
					break;
					default:
						$error="Unhandled PDO error ".$res[1].", try again later? (if this problem persists, email me about it and I'll try to fix it up)";
				}
			}
		}
	}else{
		//they weren't trying to send POST data, don't give them an error
	}
?>

<!doctype html>
<html lang="en">

<head>
	<title>Tabby: Register</title>
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
		loadHeader();
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
		<label for="confirmpass">Confirm Password:</label>
		<input type="password" id="confirmpass" required>
		<input type="submit" value="Submit">
	</form>
	<script>
	//credit to https://codepen.io/diegoleme/pen/surIK
	var password = document.getElementById("password"),
		confirm_password = document.getElementById("confirmpass");

	function validatePassword() {
		if (password.value != confirm_password.value) {
			confirm_password.setCustomValidity("Passwords Don't Match");
		} else {
			confirm_password.setCustomValidity('');
		}
	}

	password.onchange = validatePassword;
	confirm_password.onkeyup = validatePassword;
	</script>
</body>

</html>