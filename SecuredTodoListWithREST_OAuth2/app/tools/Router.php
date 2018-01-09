<?php

namespace SecuredTodoList\Tools;

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
        return $this->addRoute($path, $callable, $name, 'GET', CONF_HTML_REQUEST);
    }
    
    public function addPostRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'POST', CONF_HTML_REQUEST);
    }
    
    public function addRestGetRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'GET', CONF_JSON_REQUEST);
    }
    
    public function addRestPostRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'POST', CONF_JSON_REQUEST);
    }
    
    public function addRestPutRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'PUT', CONF_JSON_REQUEST);
    }
    
    public function addRestDeleteRoute($path, $callable, $name = null){
        return $this->addRoute($path, $callable, $name, 'DELETE', CONF_JSON_REQUEST);
    }
    
    public function addRoute($path, $callable, $name, $method, $content_type){
        if(is_string($callable) && !$name){
            //log::logging(log::LOG_DEBUG, "Adding route name for callable : $callable");
            $name = $callable;
        }
        $route_class_name = CONF_CLASS_ROUTE;
        $route = new $route_class_name(CONF_PROJECT_URI_PATH . $path, $callable, $name);
        //$route = DIC::get("route", [$path, $callable, $name]);
        //var_dump($route);
        $this->routes[$content_type][$method][] = $route;
        
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
    
    public function getCallURL(){
        return $this->url;
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
        if(isset($_SERVER['CONTENT_TYPE']) && ($_SERVER['CONTENT_TYPE'] == CONF_JSON_REQUEST)){
            $request = $_SERVER['CONTENT_TYPE'];
        }else{
            $request = CONF_HTML_REQUEST;
        }
        $method = $_SERVER['REQUEST_METHOD'];
        if(!isset($this->routes[$request][$method])){
            $routerException = CONF_CLASS_ROUTER_EXCEPTION;
            throw new $routerException('REQUEST_METHOD does not exist');
        }
        //log::logging(log::LOG_DEBUG, "--------------------------");
        foreach($this->routes[$request][$method] as $route){
            //log::logging(log::LOG_DEBUG, "Check route match with " . $route->getPath());
            //var_dump($route->getPath());
            //var_dump($this->url);
            if($route->match($this->url)){
                return $route->call();
            }
            //log::logging(log::LOG_DEBUG, "--------------------------");
        }
        if(isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] == CONF_JSON_REQUEST){
            die(json_encode("Unknown URI path"));
        }else{
            $routerException = CONF_CLASS_ROUTER_EXCEPTION;
            throw new $routerException("Error 404! Something went wrong :(");
        }
    }
}
