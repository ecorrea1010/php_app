<?php

class DB
{
    private static $instance = null;

    private function __construct() {}

    public static function getInstance()
    {
        $host = 'db';
        $port = '3306';
        $dbname = 'crud_app';
        $username = 'crud_user';
        $password = 'Crud_Password';
        $charset = 'utf8mb4';
        if (self::$instance === null) {
            self::$instance = new PDO(
                'mysql:host=' . $host . ';port=' . $port . ';dbname=' . $dbname . ';charset=' . $charset,
                "$username",
                "$password",
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        }
        return self::$instance;
    }
}