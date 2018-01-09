<?php

define('ROOT', dirname(__DIR__));
define('URI_ROOT', "/WoWOnlineBattle/game/public");

use WOWOnlineBattle\tools\Autoloader;
use WOWOnlineBattle\tools\DIC;

require ROOT . '\tools\Autoloader.php';

Autoloader::register();

set_error_handler([DIC::LOG, "errorHandler"]);

//urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$router = DIC::get(DIC::ROUTER, ["url" => urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH))]);

/**
 * Index route
 */
$router->addGetRoute(URI_ROOT . '/', 'PageController#displayIndex', 'index');
$router->addGetRoute(URI_ROOT . '/index.php', 'PageController#displayIndex');

/**
 * Account routes
 */
$router->addGetRoute(URI_ROOT . '/account', 'UserController#showUserPanel');
$router->addGetRoute(URI_ROOT . '/account/login', 'UserController#showLogin');
$router->addGetRoute(URI_ROOT . '/account/register', 'UserController#showRegister');
$router->addGetRoute(URI_ROOT . '/account/:id/register/:token', 'UserController#confirmRegisterUser');
$router->addGetRoute(URI_ROOT . '/account/forgotPassword', 'UserController#forgotPassword');
$router->addGetRoute(URI_ROOT . '/account/logoff', 'UserController#logoff');

$router->addPostRoute(URI_ROOT . '/account/login', 'UserController#processLogin');
$router->addPostRoute(URI_ROOT . '/account/register', 'UserController#register');

/**
 * Game routes
 */
$router->addGetRoute(URI_ROOT . '/play', 'PageController#displayGame');
$router->addGetRoute(URI_ROOT . '/champions', 'PageController#displayChampions');
/* $router->addGetRoute('/champion/:id',
  function($id) use ($router){echo $router->getUrl('champion.id', ['id' => 5]);},
  'champion.id'
  )->with('id', '[0-9]+'); */
$router->addGetRoute(URI_ROOT . '/champion/:id', 'PageController#displayOneChampion')->with('id', '[0-9]+');

try {
    $router->run();
} catch (Exception $ex) {
    $log = DIC::get(DIC::LOG);
    $log::logEvent($log::INFORMATION, $ex->getMessage());
    $controller = DIC::get(DIC::CONTROLLER);
    $controller::render('ContentPages/void');
}