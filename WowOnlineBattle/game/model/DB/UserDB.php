<?php

namespace WOWOnlineBattle\model\db;

use Exception;
use WOWOnlineBattle\tools\DIC;

/**
 * Description of User
 *
 * @author scoupremanj
 */
class UserDB {

    static function addUser($user) { // UserDTO $user
        try {
            /**
             * We have to check if the login & email already exists => TBD
             */
            $values = array(
                "username" => $user->getLogin(),
                "password_hash" => $user->getPassword(),
                "reg_email" => $user->getEmail(),
                "token_key" => $user->getToken(),
                "session_key" => ""
            );
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::getAuthConnection()->insert("account", $values);
            return $dbmanager::getAuthConnection()->getLastInsertId();
        } catch (Exception $e) {
            throw $e;
        }
    }

    static function getUser($login) {
        try {
            /**
             * An update is required if the user want to be automatically login
             * with a session or cookie token stored into the DB
             */
            $req = "SELECT * from account WHERE username = :login";
            $values = array(":login" => $login);
            $class = "WOWOnlineBattle\model\DTO\UserDTO";
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $userDTO = $dbmanager::getAuthConnection()->select($req, $values, $class);
            return $userDTO;
        } catch (Exception $ex) {
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }

}
