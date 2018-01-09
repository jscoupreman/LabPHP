<?php

namespace WOWOnlineBattle\controllers;

use Exception;
use WOWOnlineBattle\tools\DIC;

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
        /**
         * vérifier que l'utilisateur $_POST["username"] && $_POST["password"]
         * sont bien en DB via UserDB($login, $password)
         * si y a un row retourné
         * on crée une session avec $_SESSION["user"] = userDB fetch UserDTO
         */
        $login = self::formatVariable($_POST["username"]);
        $password = self::formatVariable($_POST["password"]);
        try {
            $session = DIC::get(DIC::SESSION);
            if (!$session->isLogged()) {
                $frontUser = DIC::get(DIC::FRONTUSER);
                $user = $frontUser::loginUser($login, $password);
                $frontUser::startUserSession($user);
                Controller::render('ContentPages/void');
            } else {
                $log = DIC::get(DIC::LOG);
                $log::logEvent($log::CRITICAL, "You are already connected !");
                Controller::render('ContentPages/void');
            }
        } catch (Exception $ex) {
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('UserPages/login');
        }
    }

    static function logoff() {
        try {
            $session = DIC::get(DIC::SESSION);
            if (!$session->isLogged()) {
                $userException = DIC::USER_EXCEPTION;
                throw new $userException("You are not connected !");
            }
            $frontUser = DIC::get(DIC::FRONTUSER);
            $frontUser::stopUserSession();
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::SUCCESS, "You have been successfully disconnected").
            Controller::render('ContentPages/void');
        } catch (Exception $ex) {
            $log = DIC::get(DIC::LOG);
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
        try {
            $login = self::formatVariable($_POST["username"]);
            $email = self::formatVariable($_POST["email"]);
            $password = self::formatVariable($_POST["password"]);
            $passwordConfirm = self::formatVariable($_POST["password_confirm"]);

            $userDTO = DIC::get(DIC::USERDTO);
            $user = new $userDTO();
            
            $vars = array();
            $user->setLogin($login);
            $vars["login"] = $login;
            $user->setEmail($email);
            $vars["email"] = $email;
            
            if ($password != $passwordConfirm) {
                $userException = DIC::USER_EXCEPTION;
                throw new $userException("Passwords does not match");
            }
            $crypto = DIC::get(DIC::CRYPTO);
            $user->setPassword($crypto::hashPassword($password));
            $frontUser = DIC::get(DIC::FRONTUSER);
            $frontUser::registerUser($user);
            unset($_POST);
            Controller::render('ContentPages/void');
        } catch (UserException $dtoex) {
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::CRITICAL, $dtoex);
            Controller::render('UserPages/register', compact('vars'));
        } catch (Exception $ex) {
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::CRITICAL, "This login or password already exists !");
            Controller::render('UserPages/register');
        }
    }

    static function formatVariable($var) {
        return strip_tags(trim($var));
    }

    static function showUserPanel() {
        
    }

    static function forgotPassword() {
        
    }

}
