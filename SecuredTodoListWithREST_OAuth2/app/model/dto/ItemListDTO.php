<?php

namespace SecuredTodoList\model\dto;

//use SecuredTodoList\tools\DIC;

/**
 * Description of ItemListDTO
 *
 * @author scoupremanj
 */
class ItemListDTO {

    public $id;
    public $listID;
    public $text;
    public $done;

    public function __construct() {
        
    }
    
    public function generateArray(){
        return get_object_vars($this);
    }

    function getId() {
        return $this->id;
    }

    function getListID() {
        return $this->listID;
    }

    function getText() {
        return $this->text;
    }

    function getDone() {
        return $this->done;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setListID($listID) {
        $this->listID = $listID;
    }

    function setText($text) {
        $this->text = $text;
    }

    function setDone($done) {
        $this->done = $done;
    }

}
