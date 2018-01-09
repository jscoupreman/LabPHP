<?php

namespace SecuredTodoList\tools;

use ReflectionClass;
use ReflectionException;



/**
 * Description of DIC
 *
 * @author scoupremanj
 */
class DIC {

    //public static $registry = [];
    public static $instances = [];
    public static $factories = [];
    

    /* public static function set($key, $class_path) {
      if($key != null && $class_path != null){
      // Warning : the key value is case sensitive
      self::$registry[$key] = $class_path;
      }else{
      throw new DICException("DIC set class association failed !");
      }
      } */

    public static function setFactory($key, Callable $resolver) {
        self::$factories[$key] = $resolver;
    }

    public static function setInstance($instance) {
        $reflection = new ReflectionClass($instance);
        self::$instances[$reflection->getName()] = $instance;
    }

    public static function get($class, $constructorVariables = []) {
        /* if(!isset(self::$registry[$key])){
          throw new DICException("Association class not found for $key");
          } */
        //$class = self::$registry[$key];
        if (!isset(self::$instances[$class])) {
            //log::logEvent(log::LOG_INFORMATION, "Instance of $key not found");
            /* if (isset(self::registry[$key])) {
              self::instances[$key] = self::registry[$key]();
              } else { */
            self::$instances[$class] = self::newInstance($class, $constructorVariables);
            //}
        }
        return self::$instances[$class];
    }

    private static function newInstance($key, $constructorVariables) {
        // autobuild reflection class
        try {
            $reflection = new ReflectionClass($key);
        } catch (ReflectionException $ex) {
            $log = self::get(self::LOG);
            $log::logEvent($log::WARNING, "Class $key does not exists");
            $controller = self::get(self::CONTROLLER);
            $controller::render('ContentPages/void');
            exit();
        }
        if ($reflection->isInstantiable()) {
            $constructor = $reflection->getConstructor();
            if (!$constructor) {
                return $reflection->newInstance();
            } else {
                return $reflection->newInstanceArgs(self::generateConstructorArgs($constructor, $constructorVariables));
            }
        } else {
            throw new Exception("Cette classe ne peut pas être instanciée !");
        }
    }

    private static function generateConstructorArgs($constructor, $constructorVariables) {
        // we need to generate constructor args
        $parameters = $constructor->getParameters();
        $constructorArgs = [];
        /**
         * Check matching of args and variables !
         */
        foreach ($parameters as $parameter) {
            if (isset($constructorVariables[$parameter->name])) {
                $arg = $constructorVariables[$parameter->name];
            } else {
                if ($parameter->getClass()) {
                    $arg = self::get($parameter->getClass()->getName());
                    //var_dump($arg);
                } else {
                    try {
                        $arg = $parameter->getDefaultValue();
                    } catch (ReflectionException $ex) {
                        // no default value
                        $arg = null;
                    }
                }
            }
            $constructorArgs[] = $arg;
        }
        return $constructorArgs;
    }

}
