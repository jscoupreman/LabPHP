<?php

namespace WOWOnlineBattle\model\db;

use Exception;
use WOWOnlineBattle\tools\DIC;

/**
 * Description of ChampionDB
 *
 * @author scoupremanj
 */
class ChampionDB {

    // Variables
    
    static function getChampions(){
        try{
            $dbmanager = DIC::get(DIC::DBMANAGER);
            return $dbmanager::getGameConnection()->query("SELECT * FROM champion", DIC::CHAMPIONDTO);
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    static function getChampion($championID){
        
    }

}