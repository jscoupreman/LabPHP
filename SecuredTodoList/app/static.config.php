<?php

use SecuredTodoList\tools\DIC;

define('CONF_PROJECT_NAME', 'SecuredTodoList');

//ROOT
define('CONF_CLASS_CONFIG', CONF_PROJECT_NAME . '\\Config');
//Controllers
define('CONF_CLASS_CONTROLLER', CONF_PROJECT_NAME . '\\controllers\\Controller');
//Business
define('CONF_CLASS_FRONTUSER', CONF_PROJECT_NAME . '\\model\\business\\FrontUser');
define('CONF_CLASS_SESSION', CONF_PROJECT_NAME . '\\model\\business\\Session');
define('CONF_CLASS_FRONTLIST', CONF_PROJECT_NAME . '\\model\\business\\FrontList');
//Tools
define('CONF_CLASS_CRYPTO', CONF_PROJECT_NAME . '\\tools\\Crypto');
define('CONF_CLASS_LOG', CONF_PROJECT_NAME . '\\tools\\log');
define('CONF_CLASS_ROUTER', CONF_PROJECT_NAME . '\\tools\\Router');
define('CONF_CLASS_ROUTE', CONF_PROJECT_NAME . '\\tools\\Route');
define('CONF_CLASS_FUNCTIONS', CONF_PROJECT_NAME . '\\tools\\Functions');
define('CONF_CLASS_ROUTER_EXCEPTION', CONF_PROJECT_NAME . '\\tools\\RouterException');
//DB
define('CONF_CLASS_DATABASE_AUTH', CONF_PROJECT_NAME . '\\model\\db\\DatabaseAuth');
define('CONF_CLASS_DATABASE_APP', CONF_PROJECT_NAME . '\\model\\db\\DatabaseApp');
define('CONF_CLASS_DBMANAGER', CONF_PROJECT_NAME . '\\model\\db\\DBManager');
define('CONF_CLASS_USERDB', CONF_PROJECT_NAME . '\\model\\db\\UserDB');
define('CONF_CLASS_LISTDB', CONF_PROJECT_NAME . '\\model\\db\\ListDB');
define('CONF_CLASS_ITEMLISTDB', CONF_PROJECT_NAME . '\\model\\db\\ItemListDB');
//DTO
define('CONF_CLASS_USERDTO', CONF_PROJECT_NAME . '\\model\\dto\\UserDTO');
define('CONF_CLASS_LISTDTO', CONF_PROJECT_NAME . '\\model\\dto\\ListDTO');
define('CONF_CLASS_ITEMLISTDTO', CONF_PROJECT_NAME . '\\model\\dto\\ItemListDTO');
//Exceptions
define('CONF_CLASS_USER_EXCEPTION', CONF_PROJECT_NAME . '\\model\\exceptions\\UserException');

//urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$var = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$router = DIC::get(CONF_CLASS_ROUTER, ["url" => $var]);

/**
 * Index route
 */
$router->addGetRoute('/', 'PageController#displayIndex', 'index');
$router->addGetRoute('/index.php', 'PageController#displayIndex');

/**
 * Account routes
 */
$router->addGetRoute('/account/:sec_token', 'UserController#showUserPanel');
$router->addGetRoute('/account/login', 'UserController#showLogin');
$router->addGetRoute('/account/register', 'UserController#showRegister');
$router->addGetRoute('/account/:id/register/:email_token/:sec_token', 'UserController#confirmRegisterUser');
$router->addGetRoute('/account/forgotPassword', 'UserController#forgotPassword');
$router->addGetRoute('/account/logoff/:sec_token', 'UserController#logoff');

$router->addPostRoute('/account/login', 'UserController#processLogin');
$router->addPostRoute('/account/register', 'UserController#register');

/**
 * List routes
 */
$router->addGetRoute('/mylists/:sec_token', 'ListController#getLists');
$router->addGetRoute('/mylists/:id/:sec_token', 'ListController#getList')->with('id', '[0-9]+');
$router->addGetRoute('/removeList/:id/:sec_token', 'ListController#removeList')->with('id', '[0-9]+');
$router->addGetRoute('/removeTask/:listID/:taskID/:sec_token', 'ListController#removeTask')->with('listID', '[0-9]+')->with('taskID', '[0-9]+');

$router->addPostRoute('/create/list', 'ListController#addList');
$router->addPostRoute('/create/task', 'ListController#addTask');