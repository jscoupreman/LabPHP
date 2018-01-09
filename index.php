<?php

class log{
    // consts
    const CONST1 = "const1";
    
    static $STATIC1 = "static1";
    //static $STATIC2 = self$STATIC1;
    
    static function getConst(){
        return self::CONST1;
    }
    
    static function getStatic(){
        return self::$STATIC1;
    }
    
    static function getStatic2(){
        return self::$STATIC2;
    }
}

var_dump(log::getConst());
var_dump(log::getStatic());
var_dump(log::getStatic2());