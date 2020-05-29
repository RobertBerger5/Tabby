<?php
	//Note: won't work if db.php isn't included first
	function loadHeader(){
		echo '
		<div class="header">
			<a href="/index.php">
				<img src="/media/logo.png" />
			</a>
			<!--all pages replace the innerHTML to be relevant to their page-->
			<h1 class="align-bottom text-center" id="pageTitle"></h1>
			<div class="text-center align-middle" id="myAccount">
		';
		if(auth($_SESSION["username"],$_SESSION["password"])){
			echo '
				<p>Signed in as '.$_SESSION["username"].'</p>
				<a href="/account/">My Account</a>
			';
		}else{
			echo '
				<p>Not signed in</p>
				<a href="/account/">Log In</a>
			';
		}
		echo '
			</div>
		</div>
		';
		return;
	}
?>