<?php
namespace TestPHP;
/**
 * Description of Autoload
 *
 * @author scoupremanj
 */
class Autoloader {
    static function autoload($class_name){
        //var_dump($class_name);
        $class_name = str_replace(__NAMESPACE__ . "\\", "", $class_name);
        var_dump($class_name);
        require 'classes\\' . $class_name . '.php';
    }
    
    static function register(){
        spl_autoload_register(array(__CLASS__, 'autoload'));
    }
}
