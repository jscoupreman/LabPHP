<?php

namespace SecuredTodoList\Tools;

/**
 * Description of Route
 *
 * @author scoupremanj
 */
class Route {

    // Variables
    private $path;
    private $callable;
    private $matches;
    private $params = [];
    private $name = null;

    public function __construct($path, $callable, $name) {
        //log::logging(log::LOG_DEBUG, "Adding route : $path");
        //$this->path = rtrim($path, '/');
        $this->path = $path;
        //var_dump($path);
        $this->callable = $callable;
        $this->name = $name;
    }
    
    public function getName(){
        return $this->name;
    }
    
    public function getPath(){
        return $this->path;
    }
    
    public function match($url){
        //log::logging(log::LOG_DEBUG, "Checking match with url : $url");
        //$url = rtrim($url, '/');
        $path = preg_replace_callback('#:([\w]+)#', [$this, 'paramMatch'], $this->path);
        //log::logging(log::LOG_DEBUG, "Route matching : path = $path");
        $regex = "#^$path$#i";
        //log::logging(log::LOG_DEBUG, "Route matching : regex = $regex");
        if(!preg_match($regex, $url, $matches)){
            //log::logging(log::LOG_DEBUG, "Route matching : <font color=\"red\">match not found</font>");
            return false;
        }
        //log::logging(log::LOG_DEBUG, "Route matching : match found");
        array_shift($matches);
        $this->matches = $matches;
        return true;
    }
    
    public function getUrl($variables = []){
        $path = $this->path;
        //var_dump($this->path);
        foreach($variables as $k => $v){
            $path = str_replace(":$k", $v, $path);
        }
        return $path;
    }
    
    private function paramMatch($match){
        //log::logging(log::LOG_DEBUG, "ParamMatch : match = ");
        //var_dump($match);
        //log::logging(log::LOG_DEBUG, "ParamMatch : params content = ");
        //var_dump($this->params[$match[1]]);
        if(isset($this->params[$match[1]])){
            return '(' . $this->params[$match[1]] . ')';
        }
        return '([^/]+)';
    }
    
    public function with($param, $regex){
        $this->params[$param] = str_replace('(', '(?:', $regex);
        //var_dump($this->params);
        return $this;
    }
    
    public function call(){
        if(is_string($this->callable)){
            $params = explode("#", $this->callable);
            $controller = "SecuredTodoList\\controllers\\" . $params[0];
            //var_dump($this->matches);
            //$controller = __NAMESPACE__ . "\\". $params[0];
            return call_user_func_array([$controller, $params[1]], $this->matches);
        }else{
            return call_user_func_array($this->callable, $this->matches);
        }
    }

}
