<?php

namespace SecuredTodoList\model\dto;

use SecuredTodoList\tools\DIC;

/**
 * Description of UserDTO
 *
 * @author scoupremanj
 */
class UserDTO {

    // Variables
    private $id;
    private $username;
    private $reg_email;
    private $password_hash;
    private $token_key;
    private $account_level;
    
    // Variables to be manage
    private $token_expiration;
    private $session_key;
    private $account_validated;
    private $backup_email;
    private $join_date;
    private $last_ip;
    private $failed_logins;
    private $last_login;
    private $online;

    public function __construct() {
    }
    
    public function setToken($token){
        if(empty($token) ||!preg_match('/^[a-fA-F0-9]+$/', $token)){
            $userException = CONF_CLASS_USER_EXCEPTION;
            throw new $userException("Invalid token");
        }
        $this->token_key = $token;
    }
    
    public function getToken(){
        return $this->token_key;
    }
    
    public function setId($id){
        if(empty($id) || !preg_match('/^[0-9]+$/', $id)){
            $userException = CONF_CLASS_USER_EXCEPTION;
            throw new $userException("Invalid user ID");
        }
        $this->id = $id;
    }
    
    public function getId(){
        return $this->id;
    }

    public function setLogin($login) {
        if (empty($login) || !preg_match('/^[a-zA-Z0-9_]+$/', $login)) {
            $userException = CONF_CLASS_USER_EXCEPTION;
            throw new $userException("Login invalide");
        }
        $this->username = $login;
    }

    public function getLogin() {
        return $this->username;
    }

    public function setEmail($email) {
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $userException = CONF_CLASS_USER_EXCEPTION;
            throw new $userException("Email invalide");
        }
        $this->reg_email = $email;
    }

    public function getEmail() {
        return $this->reg_email;
    }

    public function setPassword($password) {
        if (empty($password)) { // /!\ check password complexity ?
            $userException = CONF_CLASS_USER_EXCEPTION;
            throw new $userException("Mot de passe invalide");
        }
        $this->password_hash = $password;
    }

    public function getPassword() {
        return $this->password_hash;
    }
    
    public function setAccountLevel($level){
        // doit être un int compris dans le range de const level account
    }
    
    public function getAccountLevel(){
        return $this->account_level;
    }

}
