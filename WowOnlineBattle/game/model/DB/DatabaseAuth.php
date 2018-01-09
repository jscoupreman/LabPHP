<?php

namespace WOWOnlineBattle\model\db;

/**
 * Description of DatabaseGame
 *
 * @author scoupremanj
 */
class DatabaseAuth extends Database{

    // Variables

    public function __construct() {
        parent::__construct("auth");
    }

}
