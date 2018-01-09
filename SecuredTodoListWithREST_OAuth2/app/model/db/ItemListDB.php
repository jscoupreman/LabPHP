<?php

namespace SecuredTodoList\model\db;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of ItemListDB
 *
 * @author scoupremanj
 */
class ItemListDB {

    static function addItem($list, $item){
        // Should we check with one more parameter for the current user ?
        try{
            
        } catch (Exception $ex) {
            echo $ex;
            die();
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }

    static function getItems($list){
        // Should we check with one more parameter for the current user ?
        try{
            $req = "SELECT * FROM itemlist WHERE listID = :listID";
            $values = array(":listID" => $list->getId());
            $class = CONF_CLASS_ITEMLISTDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $items = $dbmanager::getAppConnection()->select($req, $values, $class);
            return $items;
        } catch (Exception $ex) {
            echo $ex;
            die();
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function removeItem($list, $itemID){
        try{
            
        } catch (Exception $ex) {
            echo $ex;
            die();
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
}
