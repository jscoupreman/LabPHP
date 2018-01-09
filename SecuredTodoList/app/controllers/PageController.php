<?php

namespace SecuredTodoList\controllers;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of ControllerTest
 *
 * @author scoupremanj
 */
class PageController extends Controller {

    static function displayErrorMessage($errorMessage) {
        $renderView = 'ContentPages/404';
        Controller::render($renderView, $errorMessage);
    }

    static function displayIndex() {
        try {
            $session = DIC::get(CONF_CLASS_SESSION);
            if (!$session->isLogged()) {
                Controller::render('UserPages/login');
            } else {
                Controller::render('ContentPages/myLists');
            }
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('ContentPages/void');
        }
    }
}
