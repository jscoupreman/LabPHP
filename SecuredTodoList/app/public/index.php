<?php

use SecuredTodoList\tools\Autoloader;
use SecuredTodoList\tools\DIC;

/**
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
 */

require "../tools/Autoloader.php";
Autoloader::register();
require "../static.config.php";

set_error_handler([CONF_CLASS_LOG, "errorHandler"]);
try {
    $router->run();
} catch (Exception $ex) {
    $log = DIC::get(CONF_CLASS_LOG);
    $log::logEvent($log::INFORMATION, $ex->getMessage());
    $controller = DIC::get(CONF_CLASS_CONTROLLER);
    $controller::render('ContentPages/void');
}