<?php

namespace WOWOnlineBattle\model\business;

use Exception;
use WOWOnlineBattle\tools\DIC;

/**
 * Description of FrontUserManagement
 *
 * @author scoupremanj
 */
class FrontUser {

    static function registerUser($user) {
        try {
            // generate registration token
            $crypto = DIC::get(DIC::CRYPTO);
            $token = $crypto::generateToken($crypto::SHA512, 512);
            $user->setToken($token);
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::startAuthTransaction();

            // add new user + check implicite des valeurs
            $userDB = DIC::get(DIC::USERDB);
            $userId = $userDB::addUser($user);
            //var_dump($userId);
            $user->setId($userId);

            $subject = "Validation de votre compte";
            $router = DIC::get(DIC::ROUTER);
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
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::SUCCESS, "Votre compte a bien été créé. Un email de confirmation "
                    . "vous a été envoyé afin d'activer votre compte.");
        } catch (Exception $ex) {
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::rollbackAuth();
            throw $ex;
        }
    }
    
    static function loginUser($login, $password){
        try {
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::startAuthTransaction();
            
            $userDB = DIC::get(DIC::USERDB);
            $userArray = $userDB::getUser($login);
            /**
             * I took the decision to split errors handling
             * For production purpose I'll use a unique message like :
             * Login failed : wrong login or password
             */
            if(empty($userArray)){
                $userException = DIC::USER_EXCEPTION;
                throw new $userException("This account does not exists");
            }
            $user = $userArray[0];
            //var_dump($user);
            if(!password_verify($password, $user->getPassword())){
                // increment failed_logins for this account
                $userException = DIC::USER_EXCEPTION;
                throw new $userException("Wrong password !");
            }
            
            $dbmanager::endAuthTransaction();
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::SUCCESS, "You have been successfully connected");
            return $user;
        } catch (Exception $ex) {
            $dbmanager = DIC::get(DIC::DBMANAGER);
            $dbmanager::rollbackAuth();
            throw $ex;
        }
    }
    
    static function startUserSession($user){
        /**
         * In case of user want to be automaticaly login we have to manage
         * cookies and sessions token
         */
        $session = DIC::get(DIC::SESSION);
        $session->login($user);
    }
    
    static function stopUserSession(){
        /**
         * In case of user want to be automaticaly login we have to manage
         * cookies and sessions token
         */
        $session = DIC::get(DIC::SESSION);
        $session->logoff();
    }

}
