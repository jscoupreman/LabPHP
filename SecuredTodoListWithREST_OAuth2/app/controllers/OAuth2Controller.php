<?php

namespace SecuredTodoList\controllers;

use Exception;
use SecuredTodoList\tools\DIC;

/**
 * Description of OAuth2Controller
 *
 * @author scoupremanj
 */
class OAuth2Controller extends Controller {

    static function authorizeApp() {
        try {
            //$frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            //$frontUser::enterMemberArea();
            $request_obj = DIC::get(CONF_CLASS_OAUTH2_REQUEST);
            $request = $request_obj::createFromGlobals();
            $response = DIC::get(CONF_CLASS_OAUTH2_RESPONSE);
            
            // validate the authorize request
            if (!DIC::get(CONF_CLASS_OAUTH2_SERVER)->validateAuthorizeRequest($request, $response)) {
                $response->send();
                die;
            }
            
            Controller::render('UserPages/oauth2_authorize');
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            // we should provide POST and GET datas to the redirected function
            Controller::render('UserPages/login', ['redirect_url' => 'OAuth2AuthorizeApp']);
        }
    }

    static function checkAuthorization() {
        try {
            //$frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            //$frontUser::enterMemberArea();
            $server = DIC::get(CONF_CLASS_OAUTH2_SERVER);
            $request_obj = DIC::get(CONF_CLASS_OAUTH2_REQUEST);
            $request = $request_obj::createFromGlobals();
            $response = DIC::get(CONF_CLASS_OAUTH2_RESPONSE);
            //$userid = $frontUser::getUser()->getId();
            
            $is_authorized = ($_POST['authorized'] === 'yes');
            $server->handleAuthorizeRequest($request, $response, $is_authorized);
            if ($is_authorized) {
                // this is only here so that you get to see your code in the cURL request. Otherwise, we'd redirect back to the client
                //var_dump($response);
                //$code = substr($response->getHttpHeader('Location'), strpos($response->getHttpHeader('Location'), 'code=') + 5, 40);
                //exit("SUCCESS! Authorization Code: $code");
                $response->send();
            }
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('UserPages/login');
        }
    }

    static function getToken() {
        try {
            //$frontUser = DIC::get(CONF_CLASS_FRONTUSER);
            //$frontUser::enterMemberArea();
            $server = DIC::get(CONF_CLASS_OAUTH2_SERVER);
            $request_obj = DIC::get(CONF_CLASS_OAUTH2_REQUEST);
            $request = $request_obj::createFromGlobals();
            $server->handleTokenRequest($request)->send();
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('UserPages/login');
        }
    }

    static function getResources() {
        try {
            $server = DIC::get(CONF_CLASS_OAUTH2_SERVER);
            $request_obj = DIC::get(CONF_CLASS_OAUTH2_REQUEST);
            $request = $request_obj::createFromGlobals();
            if (!$server->verifyResourceRequest($request)) {
                $server->getResponse()->send();
                die;
            }
            $token = $server->getAccessTokenData($request);
            /*$restController = DIC::get(CONF_CLASS_REST_CONTROLLER);
            $restController::getUser($token['access_token']);*/
            echo "ok";
        } catch (Exception $ex) {
            $log = DIC::get(CONF_CLASS_LOG);
            $log::logEvent($log::CRITICAL, $ex);
            Controller::render('UserPages/login');
        }
    }

}
