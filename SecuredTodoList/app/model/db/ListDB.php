<?php

namespace SecuredTodoList\model\db;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of ListDB
 *
 * @author scoupremanj
 */
class ListDB {
    /*
     * Class to be rewrite with config.inc.php for DB and table information
     */
    static function addList($user, $title){
        try{
            //$req = "INSET INTO list (accountID, title) values(:accountID, :title)";
            $values = array("accountID" => $user->getId(),
                "title" => $title);
            //$class = CONF_CLASS_LISTDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $config = DIC::get(CONF_CLASS_CONFIG);
            return $dbmanager::getAppConnection()->insert($config->DB["APP"]["TABLES"]["LIST"], $values);
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function removeList($user, $id){
        try{
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "DELETE FROM ".$config->DB["APP"]["TABLES"]["LIST"]." WHERE id=:id AND accountID = :accountID";
            $values = array(":accountID" => $user->getId(),
                ":id" => $id);
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::getAppConnection()->execute($req, $values);
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function removeTask($listID, $taskID){
        try{
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "DELETE FROM ".$config->DB["APP"]["TABLES"]["ITEMLIST"]." WHERE id=:taskID AND listID = :listID";
            $values = array(":listID" => $listID,
                ":taskID" => $taskID);
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::getAppConnection()->execute($req, $values);
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function getList($user, $listID){
        try{
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "SELECT * FROM ".$config->DB["APP"]["TABLES"]["LIST"]." WHERE id = :listID AND accountID = :accountID";
            $values = array(":accountID" => $user->getId(),
                ":listID" => $listID);
            $class = CONF_CLASS_LISTDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $listDTO = $dbmanager::getAppConnection()->select($req, $values, $class);
            if(!empty($listDTO)){
                return $listDTO[0];
            }
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function getLists($user){
        try{
            $config = DIC::get(CONF_CLASS_CONFIG);
            $req = "SELECT * FROM ".$config->DB["APP"]["TABLES"]["LIST"]." WHERE accountID = :accountID";
            $values = array(":accountID" => $user->getId());
            $class = CONF_CLASS_LISTDTO;
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $listDTO = $dbmanager::getAppConnection()->select($req, $values, $class);
            return $listDTO;
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
    
    static function addTask($listID, $taskTitle){
        try{
            $values = array("listID" => $listID,
                "text" => $taskTitle);
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $config = DIC::get(CONF_CLASS_CONFIG);
            $dbmanager::getAppConnection()->insert($config->DB["APP"]["TABLES"]["ITEMLIST"], $values);
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
        }
    }
}
