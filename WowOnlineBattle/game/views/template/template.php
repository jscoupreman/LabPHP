<?php
use WOWOnlineBattle\tools\Functions;
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>World of Warcraft Online Battle</title>

        <link href="<?= Functions::getRelativeURL("/CSS/normalize.css") ?>" rel="stylesheet">   
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <!--<link href="/CSS/starter.css" rel="stylesheet">-->

        <script src="<?= Functions::getRelativeURL("/JS/jquery.min.js") ?>"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
        <script src="http://localhost:8080/socket.io/socket.io.js"></script>  
    </head>
    <body>
        <?= $header ?>
        <?= $alerts ?>
        <?= $content ?>
        <?= $footer ?>
    </div>
</body>
</html>