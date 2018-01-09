<?php

namespace SecuredTodoList\tools;

/**
 * Description of logging
 *
 * @author scoupremanj
 */
class Log {

    // Variables
    const DEBUG = 0;
    const INFORMATION = 1;
    const WARNING = 2;
    const ERROR = 3;
    const CRITICAL = 4;
    const SUCCESS = 5;
    const LEVEL = self::INFORMATION;

    static function logging($level, $log_msg) {
        if ($level >= self::LEVEL) {
            $backtrace = debug_backtrace();
            $file = explode(CONF_PROJECT_NAME, $backtrace[0]["file"])[1];
            $line = $backtrace[0]["line"];
            echo self::header($level) .
            $file . ' at line ' . $line . ' : ' .
            $log_msg . '<br>';
        }
    }

    static function header($level) {
        switch ($level) {
            case self::DEBUG :
                $header = '[<font color="gray">Debug</font>]';
                break;
            case self::INFORMATION :
                $header = '[<font color="green">Information</font>]';
                break;
            case self::WARNING :
                $header = '[<font color="orange">Warning</font>]';
                break;
            case self::ERROR :
            case self::CRITICAL :
                $header = '[<font color="red">Error</font>]';
                break;
            default :
                $header = "[Log]";
        }
        return $header . " ";
    }

    static function logEvent($log_level, $log_msg) {
        if(is_object($log_msg)){
            $log_msg = $log_msg->getMessage();
        }
        if ($log_level >= self::LEVEL) {
            /*
            $backtrace = debug_backtrace();
            $file = explode(CONF_PROJECT_NAME, $backtrace[0]["file"])[1];
            $line = $backtrace[0]["line"];
            $log_msg = "$file [$line] : $log_msg";
            */ 
            switch ($log_level) {
                case self::DEBUG : self::pushEvent($log_msg, "info");
                    break;
                case self::INFORMATION : self::pushEvent($log_msg, "info");
                    break;
                case self::WARNING : self::pushEvent($log_msg, "warning");
                    break;
                case self::ERROR : self::pushEvent($log_msg, "danger");
                    break;
                case self::CRITICAL : self::pushEvent($log_msg, "danger");
                    break;
                case self::SUCCESS : self::pushEvent($log_msg, "success");
                    break;
            }
        }
        //PageController::displayErrorMessage(array('message' => $log_msg));
    }

    static function pushEvent($log_msg, $str_level) {
        if (!isset($GLOBALS["WOWOB"]["log"])) {
            $GLOBALS["WOWOB"]["log"] = array();
        }
        if (!isset($GLOBALS["WOWOB"]["log"][$str_level])) {
            $GLOBALS["WOWOB"]["log"][$str_level] = array();
        }
        array_push($GLOBALS["WOWOB"]["log"][$str_level], $log_msg);
    }

    static function errorHandler($errno, $errstr, $errfile, $errline, array $errcontext) {
        // error was suppressed with the @-operator
        if (0 === error_reporting()) {
            return false;
        }
        //self::displayError($errfile . ' : ' . $errstr);
        throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
    }

}
