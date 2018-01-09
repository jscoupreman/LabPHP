<?php

namespace SecuredTodoList\model\business;

use Exception;
use PDOException;
use SecuredTodoList\tools\DIC;

/**
 * Description of FrontUserManagement
 *
 * @author scoupremanj
 */
class FrontUser {
    
    static function enterMemberArea(){
        $session = DIC::get(CONF_CLASS_SESSION);
        if($session->islogged()){
            if($session->getUser()->getAccountLevel() >= 0){
                return;
            }
        }
        throw new SessionException("You must be a member to see this page");
    }
    
    static function enterAdminArea(){
        $session = DIC::get(CONF_CLASS_SESSION);
        if($session->islogged()){
            if($session->getUser()->getAccountLevel() >= 1){
                return;
            }
        }
        throw new SessionException("You must be an admin to see this page");
    }
    
    static function getUser(){
        $session = DIC::get(CONF_CLASS_SESSION);
        return $session->getUser();
    }

    static function registerUser($user) {
        try {
            // generate registration token
            $crypto = DIC::get(CONF_CLASS_CRYPTO);
            $token = $crypto::generateToken($crypto::SHA512, 512);
            $user->setToken($token);
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::startAuthTransaction();

            // add new user + check implicite des valeurs
            $userDB = DIC::get(CONF_CLASS_USERDB);
            $userId = $userDB::addUser($user);
            //var_dump($userId);
            $user->setId($userId);

            $subject = "Validation de votre compte";
            $router = DIC::get(CONF_CLASS_ROUTER);
            $content = "Bonjour " .
                    $user->getLogin() .
                    ", veuillez valider votre compte en cliquant sur le lien "
                    . "suivant : http://localhost" .
                    $router->getUrl(
                            'UserController#confirmRegisterUser', [
                        "id" => $user->getId(),
                        "token" => $token
                    ]) . "\n\n Attention, ce lien de validation expire dans 24h !";
            // mail feature must be fixed due to a bug with maildev app
            //mail($user->getEmail(), $subject, $content);

            $dbmanager::endAuthTransaction();
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::SUCCESS, "Votre compte a bien été créé. Un email de confirmation "
                    . "vous a été envoyé afin d'activer votre compte.");
        }catch (PDOException $pdoex){
            $userException = CONF_CLASS_USER_EXCEPTION;
            throw new $userException("Registering failed");
        }catch (Exception $ex) {
            $dbmanager = DIC::get(CONF_CLASS_DBMANAGER);
            $dbmanager::rollbackAuth();
            throw $ex;
        }
    }
    
    static function loginUser($login, $password){
        try {            
            $userDB = DIC::get(CONF_CLASS_USERDB);
            $userArray = $userDB::getUser($login);
            /**
             * I took the decision to split errors handling
             * For production purpose I'll use a unique message like :
             * Login failed : wrong login or password
             */
            if(empty($userArray)){
                $userException = CONF_CLASS_USER_EXCEPTION;
                throw new $userException("This account does not exists");
            }
            $user = $userArray[0];
            //var_dump($user);
            if(!password_verify($password, $user->getPassword())){
                // increment failed_logins for this account
                $userException = CONF_CLASS_USER_EXCEPTION;
                throw new $userException("Wrong password !");
            }
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::SUCCESS, "You have been successfully connected");
            self::startUserSession($user);
        } catch (Exception $ex) {
            throw $ex;
        }
    }
    
    static function startUserSession($user){
        /**
         * In case of user want to be automaticaly login we have to manage
         * cookies and sessions token
         */
        $session = DIC::get(CONF_CLASS_SESSION);
        $session->login($user);
    }
    
    static function stopUserSession(){
        /**
         * In case of user want to be automaticaly login we have to manage
         * cookies and sessions token
         */
        $session = DIC::get(CONF_CLASS_SESSION);
        $session->logoff();
    }
    
    static function isLogged(){
        $session = DIC::get(CONF_CLASS_SESSION);
        $session->isLogged();
    }
    
    static function isPasswordStrong($password){
        /**
         * le password doit avoir :
         * 8 caractère [a-z] et [A-Z] et [0-9] [caractères spéciaux]
         * 10 caractère [a-z] et [A-Z] et [0-9]
         * 12 caractère [a-z] et [0-9]
         * 14 caractère [a-z]
         */
    }

}
