<?php

use TestPHP\Autoloader;
use TestPHP\DIC;
use TestPHP\Database;

require 'classes/Autoloader.php';
Autoloader::register();



/*
   $dic = new DIC();
   $dic->set('database', function(){
  return new database("db_name", "root", "root");
  });
    $dic->set('model', function() use ($dic){
  return new model($dic->get('database'));
  });
  */

/*
  $dic = new DIC();
  $dic->set('database', function(){
  return new database("db_name", "root", "root");
  });
  $dic->setFactory('model', function() use ($dic){
  return new model($dic->get('database'));
  });

  */

 $dic = new DIC();
  $dic->setInstance(new database('localhost', "rootaaa", "rootbbb"));
  $dic->get('TestPHP\Model'); 

    var_dump($dic);
  exit(0);
  
  
  $dic->setInstance(new database('localhost', "rootaab", "rootbbb"));
  var_dump($dic->get('model'));
 




  $dic->setFactory('model', function() use ($dic){
  return new model($dic->get('database'));
  }); 

  
  
  
function crypto_rand_secure($min, $max) {
    $range = $max - $min;
    if ($range < 1)
        return $min; // not so random...
    $log = ceil(log($range, 2));
    $bytes = (int) ($log / 8) + 1; // length in bytes
    $bits = (int) $log + 1; // length in bits
    $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
    do {
        $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
        $rnd = $rnd & $filter; // discard irrelevant bits
    } while ($rnd >= $range);
    return $min + $rnd;
}

function getToken($length) {
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    $max = strlen($codeAlphabet) - 1;
    for ($i = 0; $i < $length; $i++) {
        $token .= $codeAlphabet[crypto_rand_secure(0, $max)];
    }
    return $token;
}

/*
  echo "md5 uniqid rand";
  var_dump(md5(uniqid(rand(), true)));
  var_dump(md5(uniqid(rand(), true)));
  var_dump(md5(uniqid(rand(), true)));
  var_dump(md5(uniqid(rand(), true)));
  echo "md5 uniqid login";
  var_dump(md5(uniqid("login", true)));
  var_dump(md5(uniqid("login", true)));
  var_dump(md5(uniqid("login2", true)));

  echo "crypto rand secure";
  var_dump(hash("sha512", getToken(512), false));
  var_dump(hash("sha512", getToken(512), false));
  var_dump(hash("sha512", getToken(512), false));
  var_dump(hash("sha512", getToken(512), false));
 */



$db = new Database('auth');
var_dump($db->getAutocommitState());
var_dump($db->query("SELECT @@autocommit"));
$db->beginTransaction();
var_dump($db->getAutocommitState());
var_dump($db->query("SELECT @@autocommit"));
$db->commit();
var_dump($db->getAutocommitState());
var_dump($db->query("SELECT @@autocommit"));
