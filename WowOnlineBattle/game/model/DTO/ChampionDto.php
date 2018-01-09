<?php

namespace WOWOnlineBattle\model\dto;

/**
 * Description of ChampionDto
 *
 * @author scoupremanj
 */
class ChampionDto {

    // Variables
    private $id;
    private $active;
    private $wowheadReferenceID;
    private $wowheadReferenceGUID;

    public function __construct() {
        
    }
    
    public function getId(){
        return $this->id;
    }
    
    public function isActive(){
        return $this->active === 1;
    }
    
    public function getWHRefId(){
        return $this->wowheadReferenceID;
    }
    
    public function getWHRefGUID(){
        return $this->wowheadReferenceGUID;
    }
    
    public function __toString() {
        $ret = "Champion " . $this->id . "] : ";
        $ret .= "active[" . $this->active . "] ";
        $ret .= "RefID[" . $this->wowheadReferenceID . "] ";
        $ret .= "RefGUID[" . $this->wowheadReferenceGUID . "]<br>";
        return $ret;
    }
}