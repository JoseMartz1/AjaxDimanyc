<?php
require 'cdn/database.php';

$query = mysqli_query($connection, "SELECT * FROM task ORDER BY id ASC");

if(!$query){
    die('Query failed: '. mysqli_error($connection));
}

$json = array();
while($row = mysqli_fetch_array($query)){
    $json[] = array(
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description']
    );
    
}
$jsonstring = json_encode($json);
echo $jsonstring;

?>