<?php

namespace SecuredTodoList\model\db;

use Exception;
use SecuredTodoList\tools\DIC;

class OAuthApplicationDB{
    
    static function addApplication($client_id, $client_secret, $redirect_uri){
        try {
            $values = array(
                "client_id" => $client_id,
                "client_secret" => $client_secret,
                "redirect_uri" => $redirect_uri
            );
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $config = DIC::get(CONF_CLASS_CONFIG);
            $dbmanager::getAuthConnection()->insert($config->DB["AUTH"]["TABLES"]["OAUTH_CLIENTS"], $values);
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    static function getApplications(){
        try {
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "SELECT * from ".$config->DB["AUTH"]["TABLES"]["OAUTH_CLIENTS"];
            $class = CONF_CLASS_OAUTHAPPLICATIONDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $applicationDTO = $dbmanager::getAuthConnection()->queryClass($req, $class);
            return $applicationDTO;
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function removeApplication(){
        
    }
}