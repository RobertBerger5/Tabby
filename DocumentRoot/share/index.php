<?php
	require '../../includedPHP/db.php';
	require '../../includedPHP/functions.php';
	$tab_id=$_GET["tab"];
	$error=NULL;
	if(empty($tab_id)){
		$error="No tab specified.";
	}else if(empty($_SESSION) || !auth($_SESSION["username"],$_SESSION["password"])){
		$error="Not signed in";
	}else{
		$exists=querySafe("SELECT EXISTS(SELECT 1 FROM users u LEFT JOIN shares s ON s.user=u.id LEFT JOIN tabs t ON s.tab=t.id WHERE u.username=? AND s.tab=?) as inDB",[$_SESSION["username"],$tab_id],PDO::FETCH_ASSOC)[0];
		if(!$exists["inDB"]){
			$error="Error retreiving tab: Either you don't have permission or it doesn't exist.";
		}
	}
?>

<!doctype html>
<html lang="en">

<head>
	<title>Tabby: Share</title>
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
	<link rel="stylesheet" href="share.css" />

	<script src="/general.js"></script>
	<script src="share.js"></script>
</head>

<body>
	<?php
		/*$doc=new DOMDocument();
		$doc->loadHTMLFile("../header.html");
		echo $doc->saveHTML();
		*/
		loadHeader();
		if(!empty($error)){
			echo "<script>alert(\"".$error."\")</script>";
		}
	?>
	<p>Plan for page:</p>
	<ul>
		<li>Big link to its view page</li>
		<li>Who it's shared with (mark owner)</li>
		<li>Add people or unshare (maybe only for owner?)</li>
		<li>Buttons only accessible to owners</li>
		<ul>
			<li>Make public/private</li>
			<li>Change Owner</li>
			<li>Delete</li>
		</ul>
		<li>Graph of forks from it? Or should there be a seperate info page? Would also have:</li>
		<ul>
			<li>Likes (and which users?)</li>
			<li>share info again? who has view/edit access?</li>
			<li>currently being worked on? aka recently opened or edited? (TODO: build that into DB and view page so they don't overwrite each others work all the time)</li>
			<li>tags? Also a way to add/delete em</li>
			<li>aforementioned graph of forks from it and where it was forked from. Just have private tabs show up as [private] by (username) and no link to its page (public ones should have links to their info page)</li>
		</ul>
	</ul>
	<p>It seems that I should maybe just make this page an info page, and only only allow shared users access to the tab's info page. There's a lot of things I want to do with this page, but I think it's best if I just make it one big ol page. Also it could take a while to load things, so maybe use AJAX much more liberally here. Goodnight.</p>
</body>

</html>