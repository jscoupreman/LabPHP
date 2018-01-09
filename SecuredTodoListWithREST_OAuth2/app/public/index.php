<?php

use SecuredTodoList\tools\Autoloader;
use SecuredTodoList\tools\DIC;

/**
 * 
 * /!\ Si on supprime le contenu de la DB, l'utilisateur reste toujours logé
 * -> recheck à chaque call de route ?
 * 
 * /!\ Utiliser des tokens pour l'activité des request GET / POST pour empecher
 * qu'un autre site ne puisse browser http://localhost/removelist/xxx par exemple
 * Il faut donc ajouter /removelist/xxx/token=nanana
 * comparer le token à $_SESSION["TOKEN"]
 * 
 * /!\ Si on supprime un utilisateur, il sera toujours logé car en cache !
 * Il faut donc trouver une solution pour éviter ce bug.
 * 
 * /!\ Il faut aussi clean ListDB et ItemListDB qui ont des fonctions qui doivent
 * aller dans la bonne classe (item dans item et pas dans list)
 * 
 * /!\ Tester les méthodes post avec "postman" (app google chrome)
 * 
 * CSRF : appeler une page depuis un autre site genre :
 * <img src="localhost/removeList/xxx" style="visibility: hidden">
 * forger une requête pour utiliser une session ouverte
 * 
 * XSS : insertion de code manuel dans la page via un input text, etc
 * 
 * Si on change l'ID de session du client en document.cookie...PHPSESSID=1
 * et qu'on ouvre une session privée chrome avec le set de cookie PHPSESSID=1
 * on se retrouve avec la session de l'user
 * 
 * /!\ Ne jamais avoir de session avant un login ! ou alors on supprime la session
 * et on la recrée
 * 
 * 
 * /!\ Quand on change un mot de passe, demander le pass actuel !
 * 
 * 
 * Localization : Prévoir un système de centralisation des messages dans config
 * 
 * /!\ utiliser hash_equals contre les timing attack comparison
 * uniquement en PHP >= 5.6, PHP 7
 */
require "../tools/Autoloader.php";
Autoloader::register();
require "../static.config.php";
set_error_handler([CONF_CLASS_LOG, "errorHandler"]);

$config = DIC::get(CONF_CLASS_CONFIG);

$dsn = 'mysql:dbname=' . $config->DB["AUTH"]["DB"] . ';host=' . $config->DB["AUTH"]["HOST"];

$storage = DIC::get(CONF_CLASS_OAUTH2_STORAGE, Array(
            Array(
                'dsn' => $dsn,
                'username' => $config->DB["AUTH"]["LOGIN"],
                'password' => $config->DB["AUTH"]["PASSWORD"])
                )
);
$auth_code_grant = DIC::get(CONF_CLASS_OAUTH2_GRANT_TYPE_AUTHORIZATION_CODE, [$storage]);
$refresh_token = DIC::get(CONF_CLASS_OAUTH2_REFRESH_TOKEN, [$storage]);

$server = DIC::get(CONF_CLASS_OAUTH2_SERVER, [$storage]);
$server->addGrantType($auth_code_grant);
$server->addGrantType($refresh_token);

try {
    $router->run();
} catch (Exception $ex) {
    $log = DIC::get(CONF_CLASS_LOG);
    $log::logEvent($log::INFORMATION, $ex->getMessage());
    $controller = DIC::get(CONF_CLASS_CONTROLLER);
    $controller::render('ContentPages/void');
}