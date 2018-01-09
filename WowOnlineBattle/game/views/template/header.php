<?php

use WOWOnlineBattle\tools\DIC;

function generateLiURL($routeName, $linkName) {
    $url = "<li";
    if (DIC::get(DIC::ROUTER)->isCurrentURL($routeName)) {
        $url .= ' class="active"';
    }
    $url .= '>' . generateURL($routeName, $linkName) . '</li>';
    return $url;
}

function generateURL($routeName, $linkName) {
    return '<a href="' . getUrl($routeName) . '">' . $linkName . '</a>';
}

function getURL($routeName) {
    return DIC::get(DIC::ROUTER)->getUrl($routeName);
}
?>

<nav class="navbar navbar-inverse">
    <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="<?= getUrl('index') ?>">WOW Online Battle</a>
    </div>
    <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
            <?php
            echo generateLiURL('index', 'Home');
            $session = DIC::get(DIC::SESSION);
            if (!$session->isLogged()) {
                echo generateLiURL('UserController#showLogin', 'Login');
                echo generateLiURL('UserController#register', 'Register');
            } else {
                echo generateLiURL('', 'My account');
                echo generateLiURL('PageController#displayGame', 'Play');
                echo generateLiURL('UserController#logoff', 'Logoff');
            }
            ?>
        </ul>
    </div>
</nav>