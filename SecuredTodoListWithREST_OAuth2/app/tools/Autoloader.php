<?php

namespace SecuredTodoList\tools;

/**
 * Description of Autoloader
 *
 * @author scoupremanj
 */
class Autoloader {

    static function autoload($class_name) {
        //if (strpos($class_name, CONF_PROJECT_NAME . '\\') === 0) {
            $class_name = str_replace(CONF_PROJECT_NAME . '\\', '', $class_name);
            $class_name = str_replace('\\', '/', $class_name);
            $class_name = '\\' . $class_name;
            if (!@include(".." . $class_name . '.php')) {
                $log = DIC::get(CONF_CLASS_LOG);
                $log::logEvent($log::ERROR, "Cannot include class $class_name");
            }
        /*} else {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logging($log::ERROR, $class_name . '.php not found !');
        }*/
    }

    static function register() {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }

}
