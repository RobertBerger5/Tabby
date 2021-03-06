<?php
	require '../../includedPHP/db.php';
	require '../../includedPHP/functions.php';
	
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


<!doctype html>
<html lang="en">

<head>
	<title>Tabby: Browse</title>
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

	<!--my own stylesheets and scripts-->
	<link rel="stylesheet" href="/stylesheet.css">
	<script src="/general.js"></script>
	<link rel="stylesheet" href="account.css">
	<script src="account.js"></script>
</head>

<body>
	<?php
		/*$doc=new DOMDocument();
		$doc->loadHTMLFile("../header.html");
		echo $doc->saveHTML();*/
		loadHeader();
	?>
	<p>plan for this page:</p>
	<ul>
		<li>log out</li>
		<li>delete account</li>
		<li>change username / password</li>
		<li>friends/contacts?</li>
	</ul>
</body>

</html>