<?php

namespace WOWOnlineBattle\Tools;

/**
 * Description of Router
 *
 * @author scoupremanj
 */
class Router {

    // Variables
    private $url;
    private $routes = [];
    private $namedRoutes = [];
    //private $currentView = null;
    

    public function __construct($url) {
        $this->url = $url;
    }
    
    public function addGetRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'GET');
    }
    
    public function addPostRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'POST');
    }
    
    public function addRoute($path, $callable, $name, $method){
        if(is_string($callable) && !$name){
            //log::logging(log::LOG_DEBUG, "Adding route name for callable : $callable");
            $name = $callable;
        }
        $route_class_name = DIC::ROUTE;
        $route = new $route_class_name($path, $callable, $name);
        //$route = DIC::get("route", [$path, $callable, $name]);
        //var_dump($route);
        $this->routes[$method][] = $route;
        
        if($name){
            $this->namedRoutes[$name] = $route;
        }
        return $route;
    }
   
    public function getUrl($routeName, $variables = []){
        if(!isset($this->namedRoutes[$routeName])){
            //throw new RouterException('Wanted to access an unregistred route');
            return '#';
        }
        return $this->namedRoutes[$routeName]->getUrl($variables);
    }
    
    public function isCurrentURL($routeName){
        /**
         * /!\ We have to manage POST and GET routes as they
         * could have the same path with different names
         */
        if(!isset($this->namedRoutes[$routeName])){
            //throw new RouterException('Wanted to access an unregistred route');
            return false;
        }
        return $this->namedRoutes[$routeName]->getPath() === $this->url;
    }
    
    /*
    public function setCurrentView($viewName){
        $this->currentView = $viewName;
    }
    
    public function getCurrentView(){
        return $this->currentView;
    }
    */
    
    public function getNamedRoutes(){
        return $this->namedRoutes;
    }
    
    public function getRoutes(){
        return $this->routes;
    }
    
    public function run(){
        //var_dump($this->routes);
        $method = $_SERVER['REQUEST_METHOD'];
        if(!isset($this->routes[$method])){
            $routerException = DIC::ROUTER_EXCEPTION;
            throw new $routerException('REQUEST_METHOD does not exist');
        }
        //log::logging(log::LOG_DEBUG, "--------------------------");
        foreach($this->routes[$method] as $route){
            //log::logging(log::LOG_DEBUG, "Check route match with " . $route->getPath());
            if($route->match($this->url)){
                return $route->call();
            }
            //log::logging(log::LOG_DEBUG, "--------------------------");
        }
        $routerException = DIC::ROUTER_EXCEPTION;
        throw new $routerException("Oups! Something went wrong :( I don't know this URL, sorry.");
    }
}
