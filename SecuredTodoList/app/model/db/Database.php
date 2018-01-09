<?php

namespace SecuredTodoList\model\db;

use \PDO;
use SecuredTodoList\tools\DIC;

/**
 * Description of DBConnection
 *
 * @author scoupremanj
 */
class Database {

    // Variables    
    private $db_name;
    private $db_user;
    private $db_password;
    private $db_host;
    private $pdo;

    public function __construct($db_name, $db_user = 'root', $db_password = '', $db_host = 'localhost') {
        $this->db_name = $db_name;
        $this->db_user = $db_user;
        $this->db_password = $db_password;
        $this->db_host = $db_host;
    }

    private function getPDO() {
        if ($this->pdo === null) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::DEBUG, "New PDO initialization");
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
        $sth = $this->getPDO()->prepare($query);
        $sth->execute();
        return $sth->fetchAll(PDO::FETCH_CLASS, $class_name);
    }

    public function query($query) {
        return $this->getPDO()->query($query);
    }
    
    public function execute($query, $values = []){
        $sth = $this->getPDO()->prepare($query);
        $sth->execute($values);
    }

    public function insert($table, $values = []) {
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

        $sth->execute();
        return $this->getLastInsertId();
    }
    /**
     * 
     * @return type $req = "SELECT * from account WHERE username = :login";
            $values = array(":login" => $login);
            $class = "SecuredTodoList\model\DTO\UserDTO";
            $userDTO = DBManager::getAuthConnection()->select($req, $values, $class);
     */
    
    public function select($req, $values, $class){
        $sth = $this->getPDO()->prepare($req);
        //var_dump($sth);
        $sth->execute($values);
        return $sth->fetchAll(PDO::FETCH_CLASS, $class);
    }

    public function getLastInsertId() {
        return $this->getPDO()->lastInsertId();
    }

    public function beginTransaction() {
        $log = DIC::get(CONF_CLASS_LOG);
        $log::logEvent($log::DEBUG, "Begin transaction !");
        $this->getPDO()->beginTransaction();
    }

    public function commit() {
        $log = DIC::get(CONF_CLASS_LOG);
        $log::logEvent($log::DEBUG, "Commit !");
        $this->getPDO()->commit();
    }

    public function rollback() {
        $log = DIC::get(CONF_CLASS_LOG);
        $log::logEvent($log::DEBUG, "Rollback !");
        //$this->getPDO()->rollback();
        $this->getPDO()->query('ROLLBACK');
    }

}
