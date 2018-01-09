<?php

namespace WOWOnlineBattle\controllers;

use Exception;

/**
 * Description of UserDTOException
 *
 * @author scoupremanj
 */
class PageControllerException extends Exception {

    // Variables

    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}";
    }

}