<?php
use TestPHP\Autoloader;
use TestPHP\Core\Character\Mage;
use TestPHP\Core\Character\Warrior;

require 'classes/Autoloader.php';
Autoloader::register();

$harry = new Mage("UnMage");
$neth = new Warrior("Un guerrier");

var_dump($harry);
var_dump($neth);