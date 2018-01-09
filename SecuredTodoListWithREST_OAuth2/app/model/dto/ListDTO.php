<?php
namespace SecuredTodoList\model\dto;

//use SecuredTodoList\tools\DIC;

/**
 * Description of ListDTO
 *
 * @author scoupremanj
 */
class ListDTO {

    // Variables
    public $id;
    public $accountID;
    public $title;
    public $items;

    public function __construct() {
        
    }
    
    public function generateArray(){
        return get_object_vars($this);
    }

    function getId() {
        return $this->id;
    }

    function getAccountID() {
        return $this->accountID;
    }

    function getTitle() {
        return $this->title;
    }
    
    function getItems(){
        return $this->items;
    }

    function setId($id) {
        $this->id = $id;
    }

    function setAccountID($accountID) {
        $this->accountID = $accountID;
    }

    function setTitle($title) {
        $this->title = $title;
    }
    
    function setItems($items){
        $this->items = $items;
    }

}
