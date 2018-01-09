<?php

function errorHandler($errno, $errstr, $errfile, $errline, array $errcontext) {
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
        return false;
    }
    //self::displayError($errfile . ' : ' . $errstr);
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}

function getRessources() {
    $data = array(
        'access_token' => $_SESSION['access_token']
    );

    $reply = postData("http://localhost/oauth/ressources", "POST", $data);
    if ($reply) {
        echo $reply;
        die();
        $json =  json_decode($reply);
        echo $json->message;
    } else {
        refreshToken();
    }
}

function displayGetToken() {
    echo '<a href="http://localhost:80/oauth/authorize?response_type=code&client_id=testclient&state=xyz">Récupérer mes listes</a>';
}

function refreshToken() {
    $data = array(
        'refresh_token' => $_SESSION['refresh_token'],
        'client_id' => $_SESSION['client_id'],
        'client_secret' => $_SESSION['client_secret'],
        'grant_type' => 'refresh_token'
    );
    $reply = postData("http://localhost/oauth/token", "POST", $data);
    if (!$reply) {
        displayGetToken();
    } else {
        $datas = json_decode($reply);
        $_SESSION['access_token'] = $datas->access_token;
        getRessources();
    }
}

function postData($url, $method, $data = []) {
    try {
        $data = http_build_query($data);
        $context_options = array(
            'http' => array(
                'method' => $method,
                'header' => "Content-type: application/x-www-form-urlencoded\r\n"
                . "Content-Length: " . strlen($data) . "\r\n"
                . "Server-protocol: HTTP/1.1\r\n",
                'content' => $data
            )
        );

        $context = stream_context_create($context_options);
        $fp = fopen($url, 'r', false, $context);
        return stream_get_contents($fp);
    } catch (Exception $e) {
        //var_dump($e->getMessage());
        //var_dump($http_response_header);
        return false;
    }
}
