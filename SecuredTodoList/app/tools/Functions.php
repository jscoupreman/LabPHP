<?php

namespace SecuredTodoList\tools;

/**
 * Description of Functions
 *
 * @author scoupremanj
 */
class Functions {

    static function formatPostInput($input){
        if(!isset($_POST[$input])){
            throw new FunctionsException('Oops ! Input format is not valid.');
        }
        return strip_tags(trim($_POST[$input]));
    }
}
