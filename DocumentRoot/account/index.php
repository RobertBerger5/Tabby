<?php
	$logged_in=FALSE;
	if(!$logged_in){
		header('Location: login.php', true,302);
		die();
	}
?>
<html>

<head>
	<title>Tabby: Edit and Share Tabs!</title>
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