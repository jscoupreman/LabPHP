<?php

namespace TestPHP;

/**
 * Description of Model
 *
 * @author scoupremanj
 */
class Model {

    private $database;
    private $uniqid;

    public function __construct(database $database, $array = []) {
        $this->database = $database;
        $this->uniqid = uniqid('', true);
    }

}