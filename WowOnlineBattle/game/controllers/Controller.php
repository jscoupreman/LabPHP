<?php

namespace WOWOnlineBattle\controllers;

use \Exception;
use WOWOnlineBattle\tools\DIC;
/**
 * Description of Controller
 *
 * @author scoupremanj
 */
class Controller {
    
    const GENERIC_TEMPLATE = "template/Template";
    const GAME_TEMPLATE = "template/TemplateGame";
    
    static function render($view, $variables = [], $template = self::GENERIC_TEMPLATE){
        try{
            $viewpath = ROOT . '\\views\\';
            $header = 'template\\header';
            $footer = 'template\\footer';
            extract($variables);
            $content = self::getContent($viewpath . $view . '.php');
            $alerts = self::getContent($viewpath . "contentpages\\listingLog.php");
            $header = self::getContent($viewpath. $header . '.php');
            $footer = self::getContent($viewpath . $footer . '.php');
            include($viewpath . $template . '.php');
        }catch(Exception $ex){
            $log = DIC::get(DIC::LOG);
            $log::logging($log::ERROR, "Unable to render " . $view . " ! Exception : " . $ex);
            /**
             *  We can't use the normal error handling with log::logEvent and
             *  self::render due a recurcive loop risk
             */
            
        }
    }
    
    static function getContent($path){
        ob_start();
        include($path);
        return ob_get_clean();
    }
}