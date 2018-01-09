<?php

namespace TestPHP;

/**
 * Description of Database
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

    public function query($query) {
        return $this->getPDO()->query($query)->fetch();
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

    public function getLastInsertId() {
        return $this->getPDO()->lastInsertId();
    }

    public function beginTransaction() {
        echo "Begin transaction !";
        $this->getPDO()->beginTransaction();
    }

    public function commit() {
        echo "Commit !";
        $this->getPDO()->commit();
    }

    public function rollback() {
        echo "rollback !";
        $this->getPDO()->rollback();
    }

    public function getAutocommitState() {
        return $this->getPDO()->getAttribute(PDO::ATTR_AUTOCOMMIT);
    }

}