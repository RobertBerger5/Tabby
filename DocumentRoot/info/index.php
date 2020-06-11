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
		try{
			$exists=querySafe("SELECT EXISTS(SELECT 1 FROM users u LEFT JOIN shares s ON s.user=u.id LEFT JOIN tabs t ON s.tab=t.id WHERE u.username=? AND s.tab=?) as inDB",[$_SESSION["username"],$tab_id],PDO::FETCH_ASSOC)[0];
			if(!$exists["inDB"]){
				$error="Error retreiving tab: Either you don't have permission or it doesn't exist.";
			}
		}catch(Exception $e){
			$error="PDO Error: ".$e->getMessage();
		}
	}

	$shares=NULL;
	try{
		$res=querySafe('SELECT u.username,s.can_edit FROM shares s JOIN users u ON s.user=u.id AND s.tab=?',[$tab_id],PDO::FETCH_ASSOC);
		$shares=json_encode($res);
	}catch(Exception $e){
		$error="PDO Error: ".$e->getMessage();
	}

	$owner=NULL;
	$is_public=0;
	$is_owner=0;
	try{
		$properties=querySafe('SELECT u.username,t.is_public FROM tabs t LEFT JOIN users u ON t.user=u.id WHERE t.id=?',[$tab_id],PDO::FETCH_ASSOC)[0];
		$owner=$properties["username"];
		$is_public=$properties["is_public"];
		if($_SESSION["username"]==$owner){
			$is_owner=1;
		}
	}catch(Exception $e){
		$error="PDO Error: ".$e->getMessage();
	}
?>

<!doctype html>
<html lang="en">

<head>
	<title>Tabby: Info</title>
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
	<link rel="stylesheet" href="info.css" />

	<script src="/general.js"></script>
	<script src="info.js"></script>
</head>

<body>
	<?php
		loadHeader();
		if(!empty($error)){
			echo "<script>$(document).ready(()=>{alert(\"".$error."\");});</script>";
		}
	?>
	<script>
	//get vars to js easily
	var tab_id = <?php echo $tab_id ?>;
	var owner = "<?php echo $owner?>";
	var isOwner = <?php echo $is_owner ?>;
	var isPublic = <?php echo $is_public ?>;
	var shares = JSON.parse( <?php echo json_encode($shares); ?> );
	</script>

	<div id="infoContent">
		<button>
			<a href="/view?tab=<?php echo $tab_id?>">View Tab</a>
		</button>

		<div id="ajaxStatus">
			<div id="ajaxStatus-loader"></div>
			<div id="ajaxStatus-text">Status</div>
		</div>
		
		<table class="table table-striped">
			<thead>
				<tr id="shareTableHead">
					<th>Username</th>
					<th>Edit?</th>
					<!--if owner, "Remove" and "Make Owner" headers added-->
				</tr>
			</thead>
			<tbody id="shareTableBody">
				<!--dynamically loaded-->
			</tbody>
		</table>
		<!--only display if user is tab owner-->
		<!--Note: if anyone's looking and knows anything about security, relax. Everything will be double-checked for validity server-size as well-->
		<div id="ownerButtons" class="container" style="visibility:hidden;">
			<div class="row">
				<button onclick="shareWith()" class="col-sm">Share With...</button>
				<button onclick="togglePublic()" id="button-public" class="col-sm">
					<?php
						if($is_public){
							echo "Make Private";
						}else{
							echo "Make Public";
						}
					?>
				</button>
			</div>
		</div>
		<br><br>
		<p>TODO:</p>
		<ul>
			<li>Likes (and which users??)</li>
			<li>currently being worked on? aka recently opened or edited? (TODO: build that into DB and view page so
				they
				don't overwrite each others work all the time)</li>
			<li>tags? Also a way to add/delete em</li>
			<li>Graph of forks from it and where it was forked from</li>
			<ul>
				<li>most tabs show up as (name) by (username) with link to their info page</li>
				<li>private tabs show up as [private] by (username) and without a link</li>
			</ul>
			<li>note: most of the more complicated stuff should probably be done with AJAX so the page loads up faster
			</li>
		</ul>
		</infoContent>
</body>

</html>