<?php

namespace TestPHP;

use ReflectionClass;
use ReflectionException;

/**
 * Description of DIC
 *
 * @author scoupremanj
 */
class DIC {

    private $registry = [];
    private $instances = [];
    private $factories = [];

    public function set($key, Callable $resolver) {
        $this->registry[$key] = $resolver;
    }

    public function setFactory($key, Callable $resolver) {
        $this->factories[$key] = $resolver;
    }

    public function setInstance($instance) {
        $reflection = new ReflectionClass($instance);
        $this->instances[$reflection->getName()] = $instance;
    }

    public function get($key) {
        if (isset($this->factories[$key])) {
            return $this->factories[$key]();
        }
        if (!isset($this->instances[$key])) {
            echo "instance not found";
            if (isset($this->registry[$key])) {
                $this->instances[$key] = $this->registry[$key]();
            } else {
                $this->instances[$key] = $this->newInstance($key);
            }
        }
        return $this->instances[$key];
    }

    private function newInstance($key) {
        // autobuild reflection class
        try {
            $reflection = new ReflectionClass($key);
        } catch (Exception $ex) {
            echo "Class $key does not exists";
            exit();
        }
        if ($reflection->isInstantiable()) {
            $constructor = $reflection->getConstructor();
            if (!$constructor) {
                return $reflection->newInstance();
            } else {
                return $reflection->newInstanceArgs($this->generateConstructorArgs($constructor));
            }
        } else {
            throw new Exception("Cette classe ne peut pas être instanciée !");
        }
    }

    private function generateConstructorArgs($constructor) {
        // we need to generate constructor args
        $parameters = $constructor->getParameters();
        $constructorArgs = [];
        foreach ($parameters as $parameter) {
            if ($parameter->getClass()) {
                $arg = $this->get($parameter->getClass()->getName());
            } else {
                try {
                    $arg = $parameter->getDefaultValue();
                } catch (ReflectionException $ex) {
                    // no default value
                    $arg = null;
                }
            }
            $constructorArgs[] = $arg;
        }
        return $constructorArgs;
    }

}
