<?php
require 'cdn/database.php';

$consulta = mysqli_query($connection, "SELECT * FROM task ORDER BY id DESC") or die(mysqli_error($connection));
$row = mysqli_fetch_array($consulta);
$idfila = $row['0'];

$contador = $idfila;
for($i=$contador; $i==$contador; $i++){
$idtask = $i+1;
}

if(isset($_POST['name'])){
    $name = $_POST['name'];
    $description = $_POST['description'];

    if(empty($name)){exit("0|Agregue el nombre de la tarea...");}
    if(empty($description)){exit("0|Agregue la descripción de la tarea...");}
    $query = mysqli_query($connection, "INSERT INTO task(id, name, description) VALUES('$idtask','$name', '$description')");

    if(!$query){
        exit('2|Query Failed: ' . mysqli_error($connection));
    }
    exit('1|¡Tarea Registrada Exitosamente!');
}


?>