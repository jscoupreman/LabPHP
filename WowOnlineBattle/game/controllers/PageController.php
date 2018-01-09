<?php

namespace WOWOnlineBattle\controllers;

use \Exception;
use WOWOnlineBattle\tools\DIC;

/**
 * Description of ControllerTest
 *
 * @author scoupremanj
 */
class PageController extends Controller {

    // Variables

    static function displayChampions() {
        try {
            $frontGame = DIC::get(DIC::FRONTGAME);
            $champions = $frontGame::getAllChampions();
            Controller::render('ContentPages/Slideshow/Champions', compact('champions'));
        } catch (Exception $e) {
            $log = DIC::get(DIC::LOG);
            $log::logging($log::ERROR, "Impossible de récupérer les champions.");
        }
    }

    static function displayErrorMessage($errorMessage) {
        $renderView = 'ContentPages/404';
        Controller::render($renderView, $errorMessage);
    }

    static function displayIndex() {
        $renderView = 'ContentPages/index';
        Controller::render($renderView);
    }

    static function displayOneChampion($id) {
        //TODO
        //var_dump($id);
    }

    static function displayGame() {
        try {
            $session = DIC::get(DIC::SESSION);
            if (!$session->isLogged()) {
                $PageControllerException = DIC::PAGECONTROLLER_EXCEPTION;
                throw new $PageControllerException("You must be connected to see this page");
            }
            $renderView = 'GamePages/play';
            Controller::render($renderView, [], Controller::GAME_TEMPLATE);
        } catch (PageControllerException $ex) {
            $log = DIC::get(DIC::LOG);
            $log::logEvent($log::CRITICAL, $ex->getMessage());
            Controller::render('ContentPages/void');
        }
    }

}
