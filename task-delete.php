<?php
require 'cdn/database.php';

if(isset($_POST['id'])){
    $id = $_POST['id'];

    $query = mysqli_query($connection, "DELETE FROM task WHERE id = $id");

    if(!$query){
        exit("2|Query Failed: ". mysqli_error($connection));
    }
    exit("1|¡Tarea Eliminada Exitosamente!");
}


?>