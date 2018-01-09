<?php

namespace SecuredTodoList\controllers;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of ControllerTest
 *
 * @author scoupremanj
 */
class RestController extends Controller {

    static function getUser($rest_token) {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $user = $frontUser->getRestUser($rest_token);
            
            header('Content-Type: application/json');
            
            if ($user == null) {
                echo json_encode(array('success' => false, 'message' => 'Undefined user token'));
            }else{
                echo json_encode(array('success' => true, 'data' => $user));
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
            die();
        }
    }

    static function getLists($rest_token) {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $user = $frontUser->getRestUser($rest_token);
            
            header('Content-Type: application/json');
            
            if ($user == null) {
                echo json_encode(array('success' => false, 'message' => 'Undefined user token'));
            }else{
                $frontList = DIC::get(CONF_CLASS_FRONTLIST);
                $lists = $frontList->getLists($user);
                echo json_encode(array('success' => true, 'data' => $lists));
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
            die();
        }
    }

    static function getList($listID, $rest_token) {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $user = $frontUser->getRestUser($rest_token);
            
            header('Content-Type: application/json');
            
            if ($user == null) {
                echo json_encode(array('success' => false, 'message' => 'Undefined user token'));
            }else{
                $frontList = DIC::get(CONF_CLASS_FRONTLIST);
                $list = $frontList->getList($user, $listID);
                echo json_encode(array('success' => true, 'data' => $list));
            }
        } catch (Exception $ex) {
            echo $ex->getMessage();
            die();
        }
    }
    
    static function getItems($listID, $rest_token){
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $user = $frontUser->getRestUser($rest_token);
            
            header('Content-Type: application/json');
            
            if ($user == null) {
                echo json_encode(array('success' => false, 'message' => 'Undefined user token'));
            }else{
                $frontList = DIC::get(CONF_CLASS_FRONTLIST);
                $items = $frontList->getList($user, $listID)->getItems();
                echo json_encode(array('success' => true, 'data' => $items));
            }
        } catch (Exception $ex) {
     
            echo $ex->getMessage();
            die();
        }
    }
    
    static function addList($rest_token){
        $post = json_decode(file_get_contents('php://input'));
        if(isset($post->title)){
            $functions = DIC::get(CONF_CLASS_FUNCTIONS);
            echo $functions::protectString($post->title);
        }
    }

    static function post($rest_token) {
        die("post rest : " . $rest_token);
    }

    static function put($rest_token) {
        die("put rest" . $rest_token);
    }

    static function delete($rest_token) {
        die("delete rest" . $rest_token);
    }

}
