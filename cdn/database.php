<?php 
error_reporting(0);
date_default_timezone_set('America/Mexico_City');
// datos de la bd
$serie = array("h"=>"localhost","u"=>"root","p"=>"","bd"=>"tasks-app");
$connection = @mysqli_connect($serie['h'],$serie['u'],$serie['p'],$serie['bd']);
@mysqli_query($connection, "SET CHARSET 'utf8'");
if(!$connection) {
	exit("<div style='font: 1.3em bold Verdana,Arial; text-align:center';><br><span style='color:red;'>Error al conectar a la Base de Datos:</div>
		<div style='background: #DDD; color: black; padding: 5px; margin: 5px auto; width: 600px; font: bold 11px arial,verdana;'>".mysqli_connect_error()."</div>");
}

?>