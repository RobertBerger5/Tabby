<?php
$pdo = new PDO('mysql:host=db;dbname=tabby;charset=utf8', 'tab_admin', 'controllerofthetabs');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt=$pdo->query('SELECT * FROM tabs');
while($row=$stmt->fetch()){
	echo $row['text']."\n";
}
?>