<?php
require_once 'functions.php';

session_start();
$_SESSION['client_id'] = 'testclient';
$_SESSION['client_secret'] = 'testpass';
set_error_handler("errorHandler");

if (isset($_GET['code'])) {
    $data = array(
        'client_id' => $_SESSION['client_id'],
        'client_secret' => $_SESSION['client_secret'],
        'grant_type' => 'authorization_code',
        'code' => $_GET['code']
    );

    $reply = postData("http://localhost/oauth/token", "POST", $data);
    $datas = json_decode($reply);
    $_SESSION['access_token'] = $datas->access_token;
    $_SESSION['refresh_token'] = $datas->refresh_token;
}elseif(!isset($_SESSION['access_token'])){
    displayGetToken();
}

if(isset($_SESSION['access_token']) && isset($_SESSION['refresh_token'])){
    getRessources();
}

?>