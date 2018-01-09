<?php

namespace WOWOnlineBattle\model\business;

/**
 * Description of Session
 *
 * @author Dysnome
 */
class Session {
    
    public function __construct() {
        if (!$this->startSession()) {
            //log::logEvent(log::LOG_CRITICAL, "Session error : could not login you");
            //throw new SessionException("Session error : could not login you");
        }
    }

    private function startSession() {
        /**
         * We have to check if a PHPSESSID exists and if it's correcly formated
         * due to a bug I got with PHPSESSID + hmac (SHA 256) with
         * Redis shared sessions
         * 
         * PHPSESSID with hmac : s:1N8QO03SekFaD5Et9KS80o9BsVvD9PW8.i/D9uIql5y2OptEk3/eGKJtMjz2eawOqmHbBPomxGA0
         * PHPSESSID without hmac : qg8i6di6iq87hsadjd78vge8v6
         */
        if (ini_get('session.use_cookies') && isset($_COOKIE['PHPSESSID'])) {
            $session_id = $_COOKIE['PHPSESSID'];
        } elseif (!ini_get('session.use_only_cookies') && isset($_GET['PHPSESSID'])) {
            $session_id = $_GET['PHPSESSID'];
        } else {
            session_start();
            return false;
        }
        if (!preg_match('/^[a-z0-9]{26}$/', $session_id)) {
            unset($_COOKIE['PHPSESSID']);
        }
        session_start();

        return true;
    }

    public function login($user) {
        $_SESSION["user"] = $user;
    }

    public function getUser() {
        if (isset($_SESSION["user"])) {
            return $_SESSION["user"];
        }
        return null;
    }

    public function isLogged() {
        return isset($_SESSION["user"]);
    }

    public function logoff() {
        unset($_SESSION["user"]);
        session_destroy();
    }

}
