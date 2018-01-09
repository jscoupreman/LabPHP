<?php
namespace TestPHP\Core\Character;
/**
 * Description of Personnage
 *
 * @author scoupremanj
 */
abstract class Character {
    protected $health = 100;
    protected $mana = 100;
    protected $nickname = null;
    protected $attackType = null;
    protected $spell_power = 0;
    protected $strength = 0;
    
    public function __construct($nickname){
        $this->nickname = $nickname;
    }
    
    public function getHealth() {
        return $this->health;
    }

    public function getStamina() {
        return $this->stamina;
    }

    public function getNickname() {
        return $this->nickname;
    }

    public function setHealth($health) {
        $this->health = $health;
    }

    public function setStamina($stamina) {
        $this->stamina = $stamina;
    }

    public function setName($nickname) {
        $this->nickname = $nickname;
    }

}
