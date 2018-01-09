<?php

namespace SecuredTodoList\model\db;

use SecuredTodoList\tools\DIC;

/**
 * Description of DatabaseGame
 *
 * @author scoupremanj
 */
class DatabaseApp extends Database{

    // Variables

    public function __construct() {
        $config = DIC::get(CONF_CLASS_CONFIG);
        parent::__construct(
                $config->DB["APP"]["DB"],
                $config->DB["APP"]["LOGIN"],
                $config->DB["APP"]["PASSWORD"],
                $config->DB["APP"]["HOST"]
                );
    }

}
