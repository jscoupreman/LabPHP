<?php
namespace TestPHP\Core\Character;

use TestPHP\Core\Spell\AttackType;

/**
 * Description of Mage
 *
 * @author scoupremanj
 */
class Mage extends Character{
    protected $spell_power = 20;
    protected $attackType = AttackType::Physical;
}
