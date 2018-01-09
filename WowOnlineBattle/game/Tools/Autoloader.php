<?php

namespace WOWOnlineBattle\tools;

/**
 * Description of Autoloader
 *
 * @author scoupremanj
 */
class Autoloader {

    static $NAMESPACE = "WOWOnlineBattle"; // to be change

    static function autoload($class_name) {
        if (strpos($class_name, self::$NAMESPACE . '\\') === 0) {
            $class_name = str_replace(self::$NAMESPACE, '', $class_name);
            $class_name = str_replace('\\', '/', $class_name);

            if (!@include(".." . $class_name . '.php')) {
                $log = DIC::get(DIC::LOG);
                $log::logEvent($log::ERROR, "Cannot include class $class_name");
            }
        } else {
            $log = DIC::get(DIC::LOG);
            $log::logging($log::ERROR, $class_name . '.php not found !');
        }
    }

    static function register() {
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }

}
