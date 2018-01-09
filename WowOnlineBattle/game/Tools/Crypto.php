<?php

namespace WOWOnlineBattle\Tools;

/**
 * Description of Tools
 *
 * @author scoupremanj
 */
class Crypto {

    const MD5 = "md5";
    const SHA256 = "sha256";
    const SHA512 = "sha512";

    /**
     * 
     * @param type $hash_function must be a const of Crypto class
     * @param type $length 128 <= $length <= 512
     */
    static function generateToken($hash_function = self::SHA256, $length = 128) {
        // check min / max length
        return hash($hash_function, self::getToken($length), false);
    }

    static function getToken($length) {
        $token = "";
        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
        $codeAlphabet.= "0123456789";
        $max = strlen($codeAlphabet) - 1;
        for ($i = 0; $i < $length; $i++) {
            $token .= $codeAlphabet[self::crypto_rand_secure(0, $max)];
        }
        return $token;
    }

    static function crypto_rand_secure($min, $max) {
        $range = $max - $min;
        if ($range < 1)
            return $min; // not so random...
        $log = ceil(log($range, 2));
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd >= $range);
        return $min + $rnd;
    }
    
    static function hashPassword($password){
        $options = [
            'cost' => 11,
            'salt' => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM)
        ];
        return password_hash($password, PASSWORD_BCRYPT, $options);
    }

}
