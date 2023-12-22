<?php
require 'cdn/database.php';


    $id = $_POST['id'];
    $name = $_POST['name'];
    $description = $_POST['description'];

    if(empty($id)){exit("0|No existe identificador ::: Tarea :::");}
    if(empty($name)){exit("0|Agregue el nombre de la tarea...");}
    if(empty($description)){exit("0|Agregue la descripción de la tarea...");}
    $query = mysqli_query($connection, "UPDATE task SET name = '$name', description = '$description' WHERE task.id = '$id'");

    if(!$query){
        exit('2|Query Failed: '. mysqli_error($connection));
    }
    exit('1|¡Tarea Actualizada Exitosamente!');



?>