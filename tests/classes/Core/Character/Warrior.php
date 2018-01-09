<?php
namespace TestPHP\Core\Character;

use TestPHP\Core\Spell\AttackType;
/**
 * Description of Guerrier
 *
 * @author scoupremanj
 */
class Warrior extends Character{
    protected $strength = 15;
    protected $attackType = AttackType::Physical;
}
