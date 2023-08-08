<?php 
require_once(dirname(__DIR__) . '/core.php');

function get_bot_guilds(): ?array
{
    try {
        $db = new DB_HANDLER();
        $db->connect();
        $res = $db->query('SELECT * FROM `guilds`');
        $db->close();

        if($res && count($res) > 0){
            return $res;
        }
    } catch(Exception $e){
        error_log($e->getMessage());
    }

    return null;
}