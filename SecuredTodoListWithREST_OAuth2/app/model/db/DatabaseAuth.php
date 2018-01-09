<?php

namespace SecuredTodoList\model\db;

use SecuredTodoList\tools\DIC;

/**
 * Description of DatabaseGame
 *
 * @author scoupremanj
 */
class DatabaseAuth extends Database{

    // Variables

    public function __construct() {
        $config = DIC::get(CONF_CLASS_CONFIG);
        parent::__construct(
                $config->DB["AUTH"]["DB"],
                $config->DB["AUTH"]["LOGIN"],
                $config->DB["AUTH"]["PASSWORD"],
                $config->DB["AUTH"]["HOST"]
                );
    }

}
