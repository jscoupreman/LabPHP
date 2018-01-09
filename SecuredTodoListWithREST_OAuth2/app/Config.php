<?php

namespace SecuredTodoList;

class Config {

    public $DB = [
        "APP" => [
            "HOST" => "localhost",
            "DB" => "rest_app",
            "LOGIN" => "root",
            "PASSWORD" => "",
            "TABLES" => [
                "ITEMLIST" => "itemlist",
                "LIST" => "list"
            ]
        ],
        "AUTH" => [
            "HOST" => "localhost",
            "DB" => "rest_auth",
            "LOGIN" => "root",
            "PASSWORD" => "",
            "TABLES" => [
                "ACCOUNT" => "account",
                "OAUTH_CLIENTS" => "oauth_clients"
            ]
        ]
    ];
}
