<?php

namespace SecuredTodoList\controllers;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of UserController
 *
 * @author scoupremanj
 */
class UserController extends Controller {

    // Variables

    static function showLogin() {
        $renderView = 'UserPages/login';
        Controller::render($renderView);
    }

    static function processLogin() {
        try {
            $functions = DIC::get(CONF_CLASS_FUNCTIONS);
            $login = $functions::formatPostInput("username");
            $password = $functions::formatPostInput("password");
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser->loginUser($login, $password);
            if (!$frontUser->isLogged()) {
                $router = DIC::get(CONF_CLASS_ROUTER);
                header("Location: " . $router->getUrl('index'));
            } else {
                $log = DIC::get(CONF_CLASS_LOG);
                $log::logEvent($log::CRITICAL, "You are already connected !");
                Controller::render('ContentPages/void');
            }
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('UserPages/login');
        }
    }

    static function logoff() {
        try {
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::enterMemberArea();
            $frontUser::stopUserSession();
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::SUCCESS, "You have been successfully disconnected").
            Controller::render('ContentPages/void');
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }

    static function showRegister() {
        $renderView = 'UserPages/register';
        Controller::render($renderView);
    }

    static function confirmRegisterUser($id, $token) {
        try {
            /**
             * on vérifie que le token correspond au user id
             * on vérifie que le token expiration est inférieur à 24h
             * si c'est inférieur on valide le compte
             * et on redirige l'utilisateur vers la page de son compte
             * /!\ dans la page account, le header change
             * sinon : à définir
             */
        } catch (Exception $ex) {
            
        }
    }

    static function register() {
        // /!\ TO BE REWRITE
        // check if account already exists
        try {
            $functions = DIC::get(CONF_CLASS_FUNCTIONS);
            $login = $functions::formatPostInput("username");
            $email = $functions::formatPostInput("email");
            $password = $functions::formatPostInput("password");
            $passwordConfirm = $functions::formatPostInput("password_confirm");

            $userDTO = DIC::get(CONF_CLASS_USERDTO);
            $user = new $userDTO();
            
            $vars = array();
            $user->setLogin($login);
            $vars["login"] = $login;
            $user->setEmail($email);
            $vars["email"] = $email;
            
            if ($password != $passwordConfirm) {
                $userException = CONF_CLASS_USER_EXCEPTION;
                throw new $userException("Passwords does not match");
            }
            $crypto = DIC::get(CONF_CLASS_CRYPTO);
            $user->setPassword($crypto::hashPassword($password));
            $frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            $frontUser::registerUser($user);
            unset($_POST);
            Controller::render('ContentPages/void');
        }catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            if(isset($vars)){
                Controller::render('UserPages/register', $vars);
            }else{
                Controller::render('UserPages/register');
            }
        }
    }
    static function showUserPanel() {
        
    }

    static function forgotPassword() {
        
    }

}
