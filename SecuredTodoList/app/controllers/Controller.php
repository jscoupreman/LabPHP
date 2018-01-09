<?php

namespace SecuredTodoList\controllers;

use \Exception;
use SecuredTodoList\tools\DIC;
/**
 * Description of Controller
 *
 * @author scoupremanj
 */
class Controller {
    
    const GENERIC_TEMPLATE = "template/Template";
    
    static function render($view, $variables = [], $template = self::GENERIC_TEMPLATE){
        try{
            $viewpath = '../views/';
            $header = 'template/header';
            $footer = 'template/footer';
            $content = self::getContent($viewpath . $view . '.php', $variables);
            $alerts = self::getContent($viewpath . "contentpages\\listingLog.php");
            $header = self::getContent($viewpath. $header . '.php');
            include($viewpath . $template . '.php');
        }catch(Exception $ex){
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logging($log::ERROR, "Unable to render " . $view . " ! Exception : " . $ex);
            /**
             *  We can't use the normal error handling with log::logEvent and
             *  self::render due a recurcive loop risk
             */
            
        }
    }
    
    static function getContent($path, $vars = []){
        ob_start();
        include($path);
        return ob_get_clean();
    }
}