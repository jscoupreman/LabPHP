<?php

namespace SecuredTodoList\model\db;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of UserDB
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
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $config = DIC::get(CONF_CLASS_CONFIG);
            $dbmanager::getAuthConnection()->insert($config->DB["AUTH"]["TABLES"]["ACCOUNT"], $values);
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
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "SELECT * from ".$config->DB["AUTH"]["TABLES"]["ACCOUNT"]." WHERE username = :login";
            $values = array(":login" => $login);
            $class = CONF_CLASS_USERDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $userDTO = $dbmanager::getAuthConnection()->select($req, $values, $class);
            return $userDTO;
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function getRestUser($rest_token) {
        try {
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "SELECT id, username, reg_email, join_date from ".$config->DB["AUTH"]["TABLES"]["ACCOUNT"]." WHERE rest_token = :rest_token";
            $values = array(":rest_token" => $rest_token);
            $class = CONF_CLASS_USERDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $userDTO = $dbmanager::getAuthConnection()->select($req, $values, $class);
            return $userDTO[0];
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function getRestToken($user) {
        try {
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "SELECT rest_token from ".$config->DB["AUTH"]["TABLES"]["ACCOUNT"]." WHERE id = :account_id";
            $values = array(":account_id" => $user->getId());
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $token = $dbmanager::getAuthConnection()->selectRaw($req, $values);
            return $token[0];
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function updateRestToken($user, $token){
        try {
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "UPDATE ".$config->DB["AUTH"]["TABLES"]["ACCOUNT"]." set rest_token = :rest_token WHERE id = :account_id";
            $values = array(":rest_token" => $token,
                ":account_id" => $user->getId());
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::getAuthConnection()->execute($req, $values);
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }

}
