<html>

<head>
	<title>Tabby: Edit and Share Tabs!</title>
</head>

<body>
	<p>plan for this page:</p>
	<ul>
		<li>my tabs</li>
		<li>shared with me</li>
		<li>public</li>
	</ul>
	<br />
	<p>Public Tabs:</p>
	<ul>
	<?php
		$pdo = new PDO('mysql:host=db;dbname=tabby;charset=utf8', 'tab_admin', 'controllerofthetabs');
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$stmt=$pdo->query('SELECT * FROM tabs')->fetchAll();
		foreach($stmt as $row){
			echo "<li>".$row['title']."</li>";
		}
	?>

</body>

</html>