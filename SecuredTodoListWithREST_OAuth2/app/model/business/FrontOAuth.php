<?php

namespace SecuredTodoList\model\business;

use Exception;
use SecuredTodoList\tools\DIC;

class FrontOAuth{
    
    static function getOAuthApplications(){
        try{
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::startAuthTransaction();
            $OAuthApplicationDB = DIC::get(CONF_CLASS_OAUTHAPPLICATIONDB);
            $applications = $OAuthApplicationDB::getApplications();
            $dbmanager::endAuthTransaction();
            return $applications;
        } catch (Exception $ex) {
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::rollbackAuth();
            throw $ex;
        }
    }
}