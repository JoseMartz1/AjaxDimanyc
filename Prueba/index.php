<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desarrollo Web | AJAX</title>
</head>
<body>
    <button onclick="sendRequest();">
        Send Ajax Request
    </button>

    <h1 id="title"></h1>

    <script>
        function sendRequest(){
            var theObject = new XMLHttpRequest();
            theObject.open('POST','backend.php',true);
            theObject.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            theObject.onreadystatechange = function(){
                console.log(theObject.responseText);
                document.getElementById('title').innerHTML = theObject.responseText;
            }
            theObject.send('username=Fazt');
        }
    </script>
    
</body>
</html>