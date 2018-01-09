<?php

namespace WOWOnlineBattle\model\db;

use WOWOnlineBattle\tools\DIC;

/**
 * This class must be rewrite
 *
 * @author scoupremanj
 */
class DBManager {

    // Variables

    static function getGameConnection() {
        /*if (!isset($GLOBALS["WOWOB"]["DatabaseGame"])) {
            $GLOBALS["WOWOB"]["DatabaseGame"] = new DatabaseGame();
        }
        return $GLOBALS["WOWOB"]["DatabaseGame"];*/
        return DIC::get(DIC::DATABASE_GAME);
    }
    
    static function getAuthConnection() {
        /*if (!isset($GLOBALS["WOWOB"]["DatabaseGame"])) {
            $GLOBALS["WOWOB"]["DatabaseGame"] = new DatabaseAuth();
        }
        return $GLOBALS["WOWOB"]["DatabaseGame"];*/
        return DIC::get(DIC::DATABASE_AUTH);
    }

    static function startGameTransaction() {
        //throw new Exception("test");
        self::getGameConnection()->beginTransaction();
    }
    
    static function startAuthTransaction() {
        //throw new Exception("test");
        self::getAuthConnection()->beginTransaction();
    }

    static function endAuthTransaction() {
        self::getAuthConnection()->commit();
    }
    
    static function endGameTransaction() {
        self::getGameConnection()->commit();
    }

    static function rollbackAuth() {
        self::getAuthConnection()->rollback();
    }
    
    static function rollbackGame() {
        self::getGameConnection()->rollback();
    }

}
