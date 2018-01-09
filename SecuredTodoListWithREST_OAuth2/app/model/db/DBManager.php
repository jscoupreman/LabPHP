<?php

namespace SecuredTodoList\model\db;

use SecuredTodoList\tools\DIC;

/**
 * This class must be rewrite
 *
 * @author scoupremanj
 */
class DBManager {    
    static function getAuthConnection() {
        return DIC::get(CONF_CLASS_DATABASE_AUTH);
    }
    
    static function startAuthTransaction() {
        self::getAuthConnection()->beginTransaction();
    }

    static function endAuthTransaction() {
        self::getAuthConnection()->commit();
    }

    static function rollbackAuth() {
        self::getAuthConnection()->rollback();
    }
    
    static function getAppConnection() {
        return DIC::get(CONF_CLASS_DATABASE_APP);
    }
    
    static function startAppTransaction() {
        self::getAppConnection()->beginTransaction();
    }

    static function endAppTransaction() {
        self::getAppConnection()->commit();
    }

    static function rollbackApp() {
        self::getAppConnection()->rollback();
    }
}
