<?php

namespace SecuredTodoList\model\business;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of FrontList
 *
 * @author scoupremanj
 */
class FrontList {
    static function getList($user, $listID){
        try {            
            $listDB = DIC::get(CONF_CLASS_LISTDB);
            $list = $listDB::getList($user, $listID);
            if(isset($list)){
                $list->setItems(self::getItems($list));
            }
            return $list;
        }catch(Exception $ex){
            throw $ex;
        }
    }
    
    static function getLists($user){
        try {            
            $listDB = DIC::get(CONF_CLASS_LISTDB);
            $lists = $listDB::getLists($user);
            foreach($lists as $list){
                $list->setItems(self::getItems($list));
            }
            return $lists;
        }catch(Exception $ex){
            throw $ex;
        }
    }
    
    static function getItems($list){
        try {
            $ItemlistDB = DIC::get(CONF_CLASS_ITEMLISTDB);
            return $ItemlistDB::getItems($list);
        }catch(Exception $ex){
            throw $ex;
        }
    }
    
    static function removeTask($user, $listID, $taskID){
        try {
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::startAppTransaction();
            //$listDB = DIC::get(CONF_CLASS_LISTDB);
            //$listID = $listDB::add($user, $title);
            $list = self::getList($user, $listID);
            if($user->getId() == $list->getAccountID()){
                $listDB = DIC::get(CONF_CLASS_LISTDB);
                $listDB->removeTask($listID, $taskID);
            }
            $dbmanager::endAppTransaction();
        }catch(Exception $ex){
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::rollbackApp();
            throw $ex;
        }
    }
    
    static function addTask($user, $listID, $taskTitle){
        try {
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::startAppTransaction();
            //$listDB = DIC::get(CONF_CLASS_LISTDB);
            //$listID = $listDB::add($user, $title);
            $list = self::getList($user, $listID);
            if($user->getId() == $list->getAccountID()){
                $listDB = DIC::get(CONF_CLASS_LISTDB);
                $listDB->addTask($listID, $taskTitle);
            }
            $dbmanager::endAppTransaction();
        }catch(Exception $ex){
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::rollbackApp();
            throw $ex;
        }
    }
    
    static function addList($user, $title){
        try {
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::startAppTransaction();
            $listDB = DIC::get(CONF_CLASS_LISTDB);
            $listID = $listDB::addList($user, $title);
            $dbmanager::endAppTransaction();
            return $listID;
        }catch(Exception $ex){
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::rollbackApp();
            throw $ex;
        }
    }
    
    static function removeList($user, $id){
        try {            
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::startAppTransaction();
            $listDB = DIC::get(CONF_CLASS_LISTDB);
            $listTitle = $listDB::removeList($user, $id);
            $dbmanager::endAppTransaction();
            return $listTitle;
        }catch(Exception $ex){
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::rollbackApp();
            throw $ex;
        }
    }
}
