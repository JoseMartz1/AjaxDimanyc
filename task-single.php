<?php
require 'cdn/database.php';

if(isset($_POST['id'])){
    $id = $_POST['id'];

    $query = mysqli_query($connection, "SELECT * FROM task WHERE id = '$id'");

    if(!$query){
        die('Query Failed: ' . mysqli_error($connection));
    }

    $json = array();
    while($row = mysqli_fetch_array($query)){
        $json[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description']
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
}


?>