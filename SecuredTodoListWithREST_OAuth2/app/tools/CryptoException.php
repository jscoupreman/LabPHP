<?php

namespace SecuredTodoList\Tools;

use Exception;

/**
 * Description of UserDTOException
 *
 * @author scoupremanj
 */
class CryptoException extends Exception {

    // Variables

    public function __construct($message, $code = 0, Exception $previous = null) {
        parent::__construct($message, $code, $previous);
    }

    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}";
    }

}