<?php
	require '../../includedPHP/db.php';
	require '../../includedPHP/functions.php';

	//TODO: just have a search query in GET info, so they can search by tags and such? Cuz this is gonna get reeeal messy if enough people actually start using it
	$loaded_tabs=NULL;
	$filter=NULL;
	$error=NULL;
	if($_GET["filter"]=="public"){
		$filter="Public Tabs";
		try{
			$res=queryNormal('SELECT t.id,t.title, u.username FROM tabs t LEFT JOIN users u ON t.user=u.id WHERE t.is_public',PDO::FETCH_ASSOC);
			$loaded_tabs=$res;
		}catch(Exception $e){
			$error="PDO ERROR: ".$e->getMessage();
		}
		
	}else if($_GET["filter"]=="shared"){
		$filter="Shared with Me";
		//doesn't display their own tabs, just ones that others have shared with them
		try{
			$res=querySafe('SELECT t.id,t.title,u.username FROM tabs t JOIN shares s ON t.id=s.tab JOIN users u ON u.id=s.user WHERE u.username=? AND NOT t.user=u.id',[$_SESSION["username"]],PDO::FETCH_ASSOC);
			$loaded_tabs=$res;
		}catch(Exception $e){
			$error="PDO ERROR: ".$e->getMessage();
		}
	}else{
		//default to my tabs
		$filter="My Tabs";
		try{
			$res=querySafe('SELECT t.id,t.title,u.username FROM tabs t JOIN users u ON u.id=t.user WHERE u.username=?',[$_SESSION["username"]],PDO::FETCH_ASSOC);
			$loaded_tabs=$res;
		}catch(Exception $e){
			$error="PDO ERROR: ".$e->getMessage();
		}
	}

	//print_r($loaded_tabs);
	if(!empty($loaded_tabs)){
		for($i=0;$i<count($loaded_tabs);$i++){
			try{
				$tags=querySafe('SELECT tag FROM tags WHERE tab=?',[$loaded_tabs[$i]['id']],PDO::FETCH_NUM);
			//TODO: clean this up? right now tags is like [["one"],["two"]]
				$loaded_tabs[$i]['tags']=$tags;

				$likes=querySafe('SELECT COUNT(*) FROM likes WHERE tab=?',[$loaded_tabs[$i]['id']],PDO::FETCH_NUM);
				$loaded_tabs[$i]['likes']=$likes[0][0];
			}catch(Exception $e){
				$error="PDO ERROR: ".$e->getMessage();
			}
		}
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
	<link rel="stylesheet" href="browse.css">
	<script src="browse.js"></script>
</head>

<body>
	<script>
	//load in tabs from server, fetched above
	var loadedTabs = JSON.parse('<?php echo json_encode($loaded_tabs) ?>');
	</script>
	<?php
		/*$doc=new DOMDocument();
		$doc->loadHTMLFile("../header.html");
		echo $doc->saveHTML();*/
		loadHeader();
		if(!empty($error)){
			echo "<script>$(document).ready(()=>{alert(\"".$error."\");});</script>";
		}
	?>

	<!--https://bootstrapious.com/p/bootstrap-sidebar-->
	<div class="sidebarWrapper">
		<nav id="sidebar" class="active">
			<div id="sidebarContent">
				<h3>Search in:</h3>
				<div class="list-group list-group-flush">
					<a href="index.php?filter=mytabs" class="list-group-item list-group-item-action">My Tabs</a>
					<a href="index.php?filter=shared" class="list-group-item list-group-item-action">Shared with Me</a>
					<a href="index.php?filter=public" class="list-group-item list-group-item-action">Public Tabs</a>
				</div>
			</div>
			<div id="sidebarCollapse" />
		</nav>
		<div id="nonSidebarContent" class="overflow-auto">
			<h3><strong><?php echo $filter ?></strong> - Sort by <select class="form-select" id="sortBy" onchange="sortTabs()">
					<option value="title" selected>Title</option>
					<option value="owner">Owner</option>
					<option value="likes">Likes</option>
				</select>
				<span id="descCheckbox">(reverse?
					<input type="checkbox" id="descending" onchange="sortTabs()">)</span>
				<!--, find <input type="search" onchange="searchTabs(this.value)"/>-->
			</h3>
			<table class="table table-hover table-striped">
				<thead>
					<tr>
						<th width="50px" scope="col">#</th>
						<th width="auto" scope="col">Title - Owner #tags</th>
						<th width="50px" scope="col">*'s</th>
					</tr>
				</thead>
				<tbody id="tabTable">
					<!--<tr>
						<td>1</td>
						<td><strong>Bleed</strong> - <i>Meshuggah</i> <span
								class="text-muted">#metal,technical,...</span></td>
						<td>20</td>
					</tr>
					<tr>
						<td>2</td>
						<td><strong>Crazy Train</strong> - <i>Andy_R</i> <span
								class="text-muted">#ozz,metal,classic,...</span></td>
						<td>45</td>
					</tr>
					<tr>
						<td>3</td>
						<td><strong>Deathamphetamine</strong> - <i>Gary</i> <span
								class="text-muted">#metal,thrash,...</span></td>
						<td>31</td>
					</tr>
					<tr>
						<td>4</td>
						<td><strong>Evisceration Plague</strong> - <i>Cannibal Corpse</i> <span
								class="text-muted">#death,metal,groovy,low_tune,keep_adding,more_tags,even_more,just,a,couple,more,done?...</span>
						</td>
						<td>27</td>
					</tr>
					<tr>
						<td>5</td>
						<td><strong>Raining Blood</strong> - <i>Slayer</i> <span
								class="text-muted">#metal,thrash,...</span></td>
						<td>42</td>
					</tr>
					<tr>
						<td>6</td>
						<td><strong>Towers of the Serpent</strong> - <i>Warbringer</i> <span
								class="text-muted">#metal,thrash,new,...</span></td>
						<td>17</td>
					</tr>
					<tr>
						<td>7</td>
						<td><strong>War Pigs</strong> <i>Andy_R</i> - <span
								class="text-muted">#classic,february5th,...</span></td>
						<td>15</td>
					</tr>
					<tr>
						<td>1</td>
						<td><strong>Bleed</strong> - <i>Meshuggah</i> <span
								class="text-muted">#metal,technical,...</span></td>
						<td>20</td>
					</tr>
					<tr>
						<td>2</td>
						<td><strong>Crazy Train</strong> - <i>Andy_R</i> <span
								class="text-muted">#ozz,metal,classic,...</span></td>
						<td>45</td>
					</tr>
					<tr>
						<td>3</td>
						<td><strong>Deathamphetamine</strong> - <i>Gary</i> <span
								class="text-muted">#metal,thrash,...</span></td>
						<td>31</td>
					</tr>
					<tr>
						<td>4</td>
						<td><strong>Evisceration Plague</strong> - <i>Cannibal Corpse</i> <span
								class="text-muted">#death,metal,groovy,low_tune,keep_adding,more_tags,even_more,just,a,couple,more,done?...</span>
						</td>
						<td>27</td>
					</tr>
					<tr>
						<td>5</td>
						<td><strong>Raining Blood</strong> - <i>Slayer</i> <span
								class="text-muted">#metal,thrash,...</span></td>
						<td>42</td>
					</tr>
					<tr>
						<td>6</td>
						<td><strong>Towers of the Serpent</strong> - <i>Warbringer</i> <span
								class="text-muted">#metal,thrash,new,...</span></td>
						<td>17</td>
					</tr>
					<tr>
						<td>7</td>
						<td><strong>War Pigs</strong> <i>Andy_R</i> - <span
								class="text-muted">#classic,february5th,...</span></td>
						<td>15</td>
					</tr>-->
				</tbody>
			</table>
		</div>
	</div>
</body>

</html>