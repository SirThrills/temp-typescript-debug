<?php

if($_SERVER['REQUEST_METHOD'] != 'POST' && $_SERVER['REQUEST_METHOD'] != 'GET'){
    http_response_code(400);
    exit();
}

require_once(dirname(__DIR__) . '/core.php');
require_once(dirname(__DIR__) . '/controllers/bot.php');

if(!is_valid_session()){
    http_response_code(401);
    exit();
}

if($_SERVER['REQUEST_METHOD'] == "POST"){
    if(!isset($_POST['type']) || !is_string($_POST['type'])){
        http_response_code(400);
        exit();
    }

    $response = array();
    switch($_POST['type']){
        case 'getGuildInfo':
            if(!isset($_POST['guildId']) || !is_string($_POST['guildId'])){
                $response = ['code' => 400, 'error' => 'invalid_guild_id'];
                break;
            }
            $data = getBotGuildInfo($_POST['guildId']);
            if($data == null){
                $response = ['code' => 204];
                break;
            }
            $response = ['code' => 200, 'data' => $data[0]];
            break;
        default:
            $response = ['code' => 400, 'error' => "not_implemented"];
    }

    http_response_code($response['code']);
    if(isset($response['error'])){
        echo json_encode($response['error']);
    }
    if(isset($response['data'])){
        echo json_encode($response['data']);
    }
    exit();
}