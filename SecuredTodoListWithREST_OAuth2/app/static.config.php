<?php

use SecuredTodoList\tools\DIC;

define('CONF_PROJECT_NAME', 'SecuredTodoList');
#define('CONF_PROJECT_URI_PATH', '/rest');
define('CONF_PROJECT_URI_PATH', '');
define('CONF_HTML_REQUEST', 'HTTP');
define('CONF_JSON_REQUEST', 'application/json');

//ROOT
define('CONF_CLASS_CONFIG', CONF_PROJECT_NAME . '\\Config');
//Controllers
define('CONF_CLASS_CONTROLLER', CONF_PROJECT_NAME . '\\controllers\\Controller');
define('CONF_CLASS_REST_CONTROLLER', CONF_PROJECT_NAME . '\\controllers\\RestController');
//Business
define('CONF_CLASS_FRONTUSER', CONF_PROJECT_NAME . '\\model\\business\\FrontUser');
define('CONF_CLASS_SESSION', CONF_PROJECT_NAME . '\\model\\business\\Session');
define('CONF_CLASS_FRONTLIST', CONF_PROJECT_NAME . '\\model\\business\\FrontList');
define('CONF_CLASS_FRONTOAUTH', CONF_PROJECT_NAME . '\\model\\business\\FrontOAuth');
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
define('CONF_CLASS_OAUTHAPPLICATIONDB', CONF_PROJECT_NAME . '\\model\\db\\OAuthApplicationDB');

//DTO
define('CONF_CLASS_USERDTO', CONF_PROJECT_NAME . '\\model\\dto\\UserDTO');
define('CONF_CLASS_LISTDTO', CONF_PROJECT_NAME . '\\model\\dto\\ListDTO');
define('CONF_CLASS_ITEMLISTDTO', CONF_PROJECT_NAME . '\\model\\dto\\ItemListDTO');
define('CONF_CLASS_OAUTHAPPLICATIONDTO', CONF_PROJECT_NAME . '\\model\\dto\\OAuthApplicationDTO');
//Exceptions
define('CONF_CLASS_USER_EXCEPTION', CONF_PROJECT_NAME . '\\model\\exceptions\\UserException');
define('CONF_CLASS_CRYPTO_EXCEPTION', CONF_PROJECT_NAME . '\\Tools\\CryptoException');
define('CONF_CLASS_FRONTUSER_EXCEPTION', CONF_PROJECT_NAME . '\\model\\business\\FrontUserException');
// OAuth2
define('CONF_CLASS_OAUTH2_SERVER', '\\OAuth2\\Server');
define('CONF_CLASS_OAUTH2_REQUEST', '\\OAuth2\\Request');
define('CONF_CLASS_OAUTH2_RESPONSE', '\\OAuth2\\Response');
define('CONF_CLASS_OAUTH2_STORAGE', '\\OAuth2\\Storage\Pdo');
define('CONF_CLASS_OAUTH2_GRANT_TYPE_AUTHORIZATION_CODE', 'OAuth2\\GrantType\\AuthorizationCode');
define('CONF_CLASS_OAUTH2_REFRESH_TOKEN', 'OAuth2\\GrantType\\RefreshToken');

//urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$var = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$router = DIC::get(CONF_CLASS_ROUTER, ["url" => $var]);

$session = DIC::get(CONF_CLASS_SESSION);

/**
 * Index route
 */
$router->addGetRoute('/', 'PageController#displayIndex', 'index');
$router->addGetRoute('/index.php', 'PageController#displayIndex');

/**
 * Account routes
 */
$router->addGetRoute('/account/:sec_token', 'UserController#showUserProfile')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addGetRoute('/account/login', 'UserController#showLogin');
$router->addGetRoute('/account/register', 'UserController#showRegister');
$router->addGetRoute('/account/:id/register/:email_token/:sec_token', 'UserController#confirmRegisterUser')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addGetRoute('/account/forgotPassword', 'UserController#forgotPassword');
$router->addGetRoute('/account/logoff/:sec_token', 'UserController#logoff')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addGetRoute('/account/generateRestToken/:sec_token', 'UserController#generateRestToken')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);

$router->addPostRoute('/account/login/:redirect_url', 'UserController#processLogin');
$router->addPostRoute('/account/login', 'UserController#processLogin');
$router->addPostRoute('/account/register', 'UserController#register');

/**
 * List routes
 */
$router->addGetRoute('/mylists/:sec_token', 'ListController#showMyLists')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addGetRoute('/mylists/:id/:sec_token', 'ListController#getList')->with('id', '[0-9]+')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addGetRoute('/removeList/:id/:sec_token', 'ListController#removeList')->with('id', '[0-9]+')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addGetRoute('/removeTask/:listID/:taskID/:sec_token', 'ListController#removeTask')->with('listID', '[0-9]+')->with('taskID', '[0-9]+')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);

$router->addPostRoute('/create/list/:sec_token', 'ListController#addList')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);
$router->addPostRoute('/create/task/:sec_token', 'ListController#addTask')->with('sec_token', $session->getSecToken())->defaultValue(['sec_token' => $session->getSecToken()]);

/**
 * REST routes
 */
$router->addRestGetRoute('/rest/:rest_token', 'RestController#getUser')->with('rest_token', '[0-9a-f]+');
$router->addRestGetRoute('/rest/lists/:rest_token', 'RestController#getLists')->with('rest_token', '[0-9a-f]+');
$router->addRestGetRoute('/rest/list/:listID/:rest_token', 'RestController#getItems')->with('rest_token', '[0-9a-f]+')->with('listID', '[0-9]+');
$router->addRestGetRoute('/rest/list/:listID/items/:rest_token', 'RestController#getItems')->with('rest_token', '[0-9a-f]+')->with('listID', '[0-9]+');

$router->addRestPostRoute('/rest/list/:rest_token', 'RestController#addList')->with('rest_token', '[0-9a-f]+');
$router->addRestPutRoute('/rest/:rest_token', 'RestController#put')->with('rest_token', '[0-9a-f]+');
$router->addRestDeleteRoute('/rest/:rest_token', 'RestController#delete')->with('rest_token', '[0-9a-f]+');


/**
 * OAuth2 routes
 */
$router->addGetRoute('/oauth/authorize', 'OAuth2Controller#authorizeApp', 'OAuth2AuthorizeApp');
$router->addGetRoute('/oauth/ressources', 'OAuth2Controller#getResources');

$router->addPostRoute('/oauth/authorize', 'OAuth2Controller#checkAuthorization');
$router->addPostRoute('/oauth/token', 'OAuth2Controller#getToken');
$router->addPostRoute('/oauth/ressources', 'OAuth2Controller#getResources');