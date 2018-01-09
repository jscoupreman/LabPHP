<?php

namespace SecuredTodoList\controllers;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of ControllerTest
 *
 * @author scoupremanj
 */
class ListController extends Controller {

    static function addList() {
        // on doit être logué
        // on doit vérifier si title existe
        // on formate title
        // on check la taille de title => regex pour a-z 0-9 et n
        // si c'est ok pour la création, on display la liste
        // si c'est pas ok pour la création, il faudrait ajouter un message d'erreur
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            if(isset($_POST['title'])){
                $title = strip_tags(trim($_POST['title']));
                $frontList = DIC::get(CONF_CLASS_FRONTLIST);
                $listID = $frontList->addList($frontUser->getUser(), $title);
                $router = DIC::get(CONF_CLASS_ROUTER);
                unset($_POST);
                header("Location: ". $router->getUrl('ListController#getList', ['id' => $listID]));
            }else{
                // cas d'erreur
            }
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }
    
    static function removeList($id){
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            $frontList = DIC::get(CONF_CLASS_FRONTLIST);
            $frontList->removeList($frontUser->getUser(), $id);
            $router = DIC::get(CONF_CLASS_ROUTER);
            header("Location: ". $router->getUrl('ListController#getLists'));
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }

    static function getList($id) {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            $frontList = DIC::get(CONF_CLASS_FRONTLIST);
            $list = $frontList->getList($frontUser->getUser(), $id);
            Controller::render('ContentPages/displayList', compact('list'));
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }
    
    static function getLists() {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            $frontList = DIC::get(CONF_CLASS_FRONTLIST);
            $lists = $frontList->getLists($frontUser->getUser());
            Controller::render('ContentPages/myLists', compact('lists'));
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }
    
    static function removeTask($listID, $taskID){
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            $frontList = DIC::get(CONF_CLASS_FRONTLIST);
            $frontList->removeTask($frontUser->getUser(), $listID, $taskID);
            $router = DIC::get(CONF_CLASS_ROUTER);
            header("Location: ". $router->getUrl('ListController#getList', ['id' => $listID]));
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }
    
    static function addTask() {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            if(isset($_POST['taskTitle']) && isset($_POST['listID'])){
                $taskTitle = strip_tags(trim($_POST['taskTitle']));
                $listID = strip_tags(trim($_POST['listID']));
                $frontList = DIC::get(CONF_CLASS_FRONTLIST);
                $frontList->addTask($frontUser->getUser(), 
                        $listID, $taskTitle);
                $router = DIC::get(CONF_CLASS_ROUTER);
                unset($_POST);
                header("Location: ". $router->getUrl('ListController#getList', ['id' => $listID]));
            }else{
                // cas d'erreur
            }
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }

}
