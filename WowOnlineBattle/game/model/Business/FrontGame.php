<?php

namespace WOWOnlineBattle\model\business;

use Exception;
use WOWOnlineBattle\tools\DIC;

/**
 * Description of FrontUser
 *
 * @author scoupremanj
 */
class FrontGame {

    // Variables
    
    static function getAllChampions(){
        try{
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::startTransaction();
            $championdb = DIC::get(DIC::CHAMPIONDB);
            $var = $championdb::getChampions();
            $dbmanager::endTransaction();
        }catch(Exception $ex){
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::rollback();
            throw $ex;
        }
        return $var;
    }

}
