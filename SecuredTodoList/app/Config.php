<?php

namespace SecuredTodoList;

class Config {

    public $DB = [
        "APP" => [
            "HOST" => "localhost",
            "DB" => "app",
            "LOGIN" => "root",
            "PASSWORD" => "",
            "TABLES" => [
                "ITEMLIST" => "itemlist",
                "LIST" => "list"
            ]
        ],
        "AUTH" => [
            "HOST" => "localhost",
            "DB" => "auth",
            "LOGIN" => "root",
            "PASSWORD" => "",
            "TABLES" => [
                "ACCOUNT" => "account"
            ]
        ]
    ];

}
