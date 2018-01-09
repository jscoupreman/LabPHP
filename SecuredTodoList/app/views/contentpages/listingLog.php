<?php
if(isset($GLOBALS["WOWOB"]["log"])){
    foreach($GLOBALS["WOWOB"]["log"] as $k => $v){
        foreach($v as $msg){
             echo '<div class="alert alert-' . $k .'" role="alert">' . $msg . '</div>';
        }
       
    }
}