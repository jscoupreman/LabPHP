<?php

namespace SecuredTodoList\model\dto;

class OAuthApplicationDTO{
    
    private $client_id;
    private $client_secret;
    private $redirect_uri;
    private $grant_types;
    private $scope;
    private $user_id;
    
    public function __construct() {
        
    }
    
    function getClient_id() {
        return $this->client_id;
    }

    function getClient_secret() {
        return $this->client_secret;
    }

    function getRedirect_uri() {
        return $this->redirect_uri;
    }

    function getGrant_types() {
        return $this->grant_types;
    }

    function getScope() {
        return $this->scope;
    }

    function getUser_id() {
        return $this->user_id;
    }

    function setClient_id($client_id) {
        $this->client_id = $client_id;
    }

    function setClient_secret($client_secret) {
        $this->client_secret = $client_secret;
    }

    function setRedirect_uri($redirect_uri) {
        $this->redirect_uri = $redirect_uri;
    }

    function setGrant_types($grant_types) {
        $this->grant_types = $grant_types;
    }

    function setScope($scope) {
        $this->scope = $scope;
    }

    function setUser_id($user_id) {
        $this->user_id = $user_id;
    }
}