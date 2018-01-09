<?php


class Database {

    // Variables    
    private $db_name;
    private $db_user;
    private $db_password;
    private $db_host;
    private $pdo;

    public function __construct($db_name = 'auth', $db_user = 'root', $db_password = '', $db_host = 'localhost') {
        $this->db_name = $db_name;
        $this->db_user = $db_user;
        $this->db_password = $db_password;
        $this->db_host = $db_host;
    }

    private function getPDO() {
        if ($this->pdo === null) {
            //log::logEvent(log::LOG_DEBUG, "New PDO initialization");
            echo "New PDO initialization";
            //try {
            $pdo = new PDO('mysql:dbname=' . $this->db_name . ';host=' . $this->db_host, $this->db_user, $this->db_password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            $pdo->setAttribute(PDO::ATTR_AUTOCOMMIT, 0);
            $this->pdo = $pdo;
            /* } catch (PDOException $ex) {
              log::logEvent(log::LOG_CRITICAL, $ex);
              } */
        }
        return $this->pdo;
    }

    public function queryClass($query, $class_name) {
        $request = $this->getPDO()->query($query);
        return $request->fetchAll(PDO::FETCH_CLASS, $class_name);
    }

    public function insert($table, $values = array()) {
        foreach ($values as $field => $v) {
            $ins[] = ':' . $field;
        }

        $ins = implode(',', $ins);
        $fields = implode(',', array_keys($values));
        $request = "INSERT INTO $table ($fields) VALUES ($ins)";

        $sth = $this->getPDO()->prepare($request);
        foreach ($values as $f => $v) {
            $sth->bindValue(':' . $f, $v);
        }
        
        return $sth->execute();
    }

    public function query($query) {
        return $this->getPDO()->query($query);
    }

    public function beginTransaction() {
        $this->getPDO()->beginTransaction();
    }

    public function commit() {
        $this->getPDO()->commit();
    }

    public function rollback() {
        $this->getPDO()->rollback();
    }

}

class UserDTOException extends Exception {
    
}

class UserDTO {

    // Variables
    private $login;
    private $email;
    private $password;

    public function __construct($user) {
        $this->setLogin($user["login"]);
        $this->setEmail($user["email"]);
        $this->checkConfirmPassword($user["password"], $user["passwordConfirm"]);
        $this->setPassword($user["password"]);
    }

    private function setLogin($login) {
        if (empty($login) || !preg_match('/^[a-zA-Z0-9_]+$/', $login)) {
            throw new UserDTOException("Login invalide");
        }
        $this->login = $login;
    }

    public function getLogin() {
        return $this->login;
    }

    private function setEmail($email) {
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new UserDTOException("Email invalide");
        }
        $this->email = $email;
    }

    public function getEmail() {
        return $this->email;
    }

    private function setPassword($password) {
        if (empty($password)) { // /!\ check password complexity
            throw new UserDTOException("Mot de passe invalide");
        }
        $this->password = $password;
    }

    public function getPassword() {
        return $this->password;
    }

    private function checkConfirmPassword($password, $passwordConfirm) {
        if ($password != $passwordConfirm) {
            throw new UserDTOException("Les mots de passe ne correspondent pas");
        }
        return true;
    }

}
/*
$user = array("login" => "user10",
    "email" => "user10@domain.com",
    "password" => "pass10",
    "passwordConfirm" => "pass10");
$userDTO = new UserDTO($user);
$db = new Database();
$values = array("username" => $userDTO->getLogin(), "password_hash" => $userDTO->getPassword(), "reg_email" => $userDTO->getEmail());
$db->insert("account", $values);
*/

$mc = new Memcached();